// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { NomidotTotalIssuance, Task } from './types';

const l = logger('Task: TotalIssuance');

/*
 *  ======= Table (TotalIssuance) ======
 */
const createTotalIssuance: Task<NomidotTotalIssuance> = {
  name: 'createTotalIssuance',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotTotalIssuance> => {
    const amount = await api.query.balances.totalIssuance.at(blockHash);

    const result = {
      amount,
    };

    l.log(`Total Issuance: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotTotalIssuance) => {
    const isPreviousBlockIssuanceTheSame = await prisma.$exists.totalIssuance({
      blockNumber: {
        number: blockNumber.toNumber() - 1,
      },
      amount: value.amount.toHex(),
    });

    if (!isPreviousBlockIssuanceTheSame) {
      const totalIssuanceCreateInput = {
        amount: value.amount.toHex(),
        blockNumber: {
          connect: {
            number: blockNumber.toNumber(),
          },
        },
      };

      await prisma.createTotalIssuance(totalIssuanceCreateInput);
    } else {
      l.log('Total Issuance did not change. Skipping...');
    }
  },
};

export default createTotalIssuance;
