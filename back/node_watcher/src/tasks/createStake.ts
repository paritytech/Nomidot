// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType } from '@polkadot/types';
import {
  AccountId,
  BlockNumber,
  Exposure,
  Hash,
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
    const currentElected: AccountId[] = await api.query.staking.currentElected.at(
      blockHash
    );
    const stakersInfoForEachCurrentElectedValidator: Exposure[] = [];
    let totalStaked = new BN(0);

    await Promise.all(
      currentElected.map(async stashId => {
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
