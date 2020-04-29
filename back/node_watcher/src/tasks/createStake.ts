// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, Option, Vec } from '@polkadot/types';
import {
  AccountId,
  Balance,
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
    let totalStaked: BN = new BN(0);
    let stakersInfoForEachCurrentElectedValidator: Exposure[] | null = [];

    if (api.query.staking.currentElected) {
      let currentElected: AccountId[] | null = await api.query.staking.currentElected.at(
        blockHash
      );

      if (currentElected) {
        await Promise.all(
          currentElected.map(async stashId => {
            let exposure: Exposure | null = await api.query.staking.stakers.at(
              blockHash,
              stashId
            );
  
            stakersInfoForEachCurrentElectedValidator!.push(exposure!);
  
            // explicitly clean reference
            exposure = null;
          })
        );
  
        // explicitly clean reference
        currentElected = null;
      }
    } else {
      let queuedKeys: Vec<ITuple<
        [AccountId, Keys]
      >> | null = await api.query.session.queuedKeys.at(blockHash);
      let validators: Vec<ValidatorId> | null = await api.query.session.validators.at(blockHash);

      let currentElected: AccountId[] | null = queuedKeys!
        .map(key => key[0])
        .filter((accountId: AccountId) =>
          validators!.includes(accountId as ValidatorId)
        );

      let currentEra: Option<EraIndex> | null = await api.query.staking.currentEra.at(
        blockHash
      );

      if (currentElected) {
        await Promise.all(
          currentElected.map(async stashId => {
            let exposure: Exposure | null = await api.query.staking.erasStakers.at(
              blockHash,
              currentEra!.unwrapOrDefault(),
              stashId
            );
  
            stakersInfoForEachCurrentElectedValidator!.push(exposure!);
          })
        );
      }

      // explicitly clean references
      currentElected = null;
      currentEra = null;
      queuedKeys = null;
      validators = null;
    }

    stakersInfoForEachCurrentElectedValidator.map(exposure => {
      if (exposure) {
        let bondTotal: Balance | null = exposure.total.unwrap();
        totalStaked = totalStaked!.add(bondTotal);
        
        // explicitly clean reference
        bondTotal = null;
      }
    });

    const result = {
      totalStaked: createType(api.registry, 'Balance', totalStaked),
    };

    l.log(`Nomidot Stake: ${JSON.stringify(result)}`);
    
    // explicitly clean references
    stakersInfoForEachCurrentElectedValidator = null;
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
