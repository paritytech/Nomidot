// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, Vec } from '@polkadot/types';
import { ITuple } from '@polkadot/types/types';
import {
  AccountId,
  BlockNumber,
  Exposure,
  Hash,
  Keys
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import BN from 'bn.js';

import { prisma } from '../generated/prisma-client';
import { Cached, NomidotStake, Task } from './types';

const l = logger('Task: Stake');

/*
 *  ======= Table (Stake) ======
 */
const createStake: Task<NomidotStake> = {
  name: 'createStake',
  read: async (
    blockHash: Hash,
    _cached: Cached,
    api: ApiPromise
  ): Promise<NomidotStake> => {
    // keys for the next session
    const queuedKeys: Vec<ITuple<[AccountId, Keys]>> = await api.query.session.queuedKeys.at(blockHash);

    const sessionKeys = queuedKeys.map(key => key[0] as AccountId);
    
    const stakersInfoForEachCurrentElectedValidator: Exposure[] = [];
    let totalStaked = new BN(0);

    await Promise.all(
      sessionKeys.map(async stashId => {
        const stakersForThisValidator: Exposure = await api.query.staking.stakers.at(
          blockHash,
          stashId
        );
        stakersInfoForEachCurrentElectedValidator.push(stakersForThisValidator);
      })
    );

    stakersInfoForEachCurrentElectedValidator.map(exposure => {
      if (exposure) {
        const bondTotal = exposure.total.unwrap();
        totalStaked = totalStaked.add(bondTotal);
      }
    });

    const result = {
      totalStaked: createType(api.registry, 'Balance', totalStaked),
    };

    l.log(`Nomidot Stake: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotStake) => {
    await prisma.createStake({
      blockNumber: {
        connect: {
          number: blockNumber.toNumber(),
        },
      },
      totalStake: value.totalStaked.toHex(),
    });
  },
};

export default createStake;
