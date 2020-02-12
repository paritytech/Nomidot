// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { DerivedStakingElected } from '@polkadot/api-derive/types';
import { createType } from '@polkadot/types';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import BN from 'bn.js';

import { prisma } from '../generated/prisma-client';
import { NomidotStake, Task } from './types';

const l = logger('Task: Stake');

/*
 *  ======= Table (Stake) ======
 */
const createStake: Task<NomidotStake> = {
  name: 'createStake',
  read: async (blockHash: Hash, api: ApiPromise): Promise<NomidotStake> => {
    const electedInfo: DerivedStakingElected = await api.derive.staking.electedInfo();
    let totalStaked = new BN(0);

    electedInfo.info.map(({ stakers }) => {
      if (stakers) {
        const bondTotal = stakers.total.unwrap();
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
    // check if the stake has changed from the previous block
    const isPreviousBlockStakeTheSame = await prisma.$exists.stake({
      blockNumber: {
        number: blockNumber.toNumber(),
      },
      totalStake: value.totalStaked.toHex(),
    });

    if (!isPreviousBlockStakeTheSame) {
      await prisma.createStake({
        blockNumber: {
          connect: {
            number: blockNumber.toNumber() - 1,
          },
        },
        totalStake: value.totalStaked.toHex(),
      });
    } else {
      l.log('Stake did not change. Skipping...');
    }
  },
};

export default createStake;
