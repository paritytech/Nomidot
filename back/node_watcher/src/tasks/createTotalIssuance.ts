// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { Cached, NomidotTotalIssuance, Task } from './types';

const l = logger('Task: TotalIssuance');

/*
 *  ======= Table (TotalIssuance) ======
 */
const createTotalIssuance: Task<NomidotTotalIssuance> = {
  name: 'createTotalIssuance',
  read: async (
    blockHash: Hash,
    _cached: Cached,
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
    await prisma.createTotalIssuance({
      amount: value.amount.toHex(),
      blockNumber: {
        connect: {
          number: blockNumber.toNumber(),
        },
      },
    });
  },
};

export default createTotalIssuance;
