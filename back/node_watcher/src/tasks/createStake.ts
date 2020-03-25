// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, Option, Vec } from '@polkadot/types';
import {
  AccountId,
  BlockNumber,
  EraIndex,
  Exposure,
  Hash,
  Keys,
  ValidatorId,
} from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';
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
    let totalStaked = new BN(0);
    const stakersInfoForEachCurrentElectedValidator: Exposure[] = [];

    if (api.query.staking.currentElected) {
      const currentElected: AccountId[] = await api.query.staking.currentElected.at(
        blockHash
      );

      await Promise.all(
        currentElected.map(async stashId => {
          const exposure: Exposure = await api.query.staking.stakers.at(
            blockHash,
            stashId
          );

          stakersInfoForEachCurrentElectedValidator.push(exposure);
        })
      );
    } else {
      const queuedKeys: Vec<ITuple<
        [AccountId, Keys]
      >> = await api.query.session.queuedKeys.at(blockHash);
      const validators = await api.query.session.validators.at(blockHash);

      const currentElected = queuedKeys
        .map(key => key[0])
        .filter((accountId: AccountId) =>
          validators.includes(accountId as ValidatorId)
        );

      const currentEra: Option<EraIndex> = await api.query.staking.currentEra.at(
        blockHash
      );

      await Promise.all(
        currentElected.map(async stashId => {
          const exposure: Exposure = await api.query.staking.erasStakers.at(
            blockHash,
            currentEra.unwrapOrDefault(),
            stashId
          );

          stakersInfoForEachCurrentElectedValidator.push(exposure);
        })
      );
    }

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
