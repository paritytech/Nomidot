// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType } from '@polkadot/types';
import { BlockNumber, Hash, Moment } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { BlockNumberCreateInput, prisma } from '../generated/prisma-client';
import { Cached, NomidotBlock, Task } from './types';

const l = logger('Task: BlockNumber');

/*
 *  ======= Table (BlockNumber) ======
 */
const createBlockNumber: Task<NomidotBlock> = {
  name: 'createBlockNumber',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotBlock> => {
    const [author] = await api.derive.chain.getHeader(blockHash);

    const startDateTime: Moment = await api.query.timestamp.now.at(blockHash);

    const result: NomidotBlock = {
      authoredBy: createType(api.registry, 'AccountId', author[1]),
      hash: blockHash,
      startDateTime,
    };

    l.log(`NomidotBlock: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotBlock) => {
    const { authoredBy, hash, startDateTime } = value;

    // edge case
    if (blockNumber.eq(1)) {
      await prisma.updateBlockNumber({
        data: {
          startDateTime: new Date(startDateTime.toNumber()).toISOString(),
        },
        where: {
          number: 0,
        },
      });
    }

    const exists = await prisma.$exists.blockNumber({
      number: blockNumber.toNumber(),
    });

    if (!exists) {
      const write = await prisma.createBlockNumber({
        number: blockNumber.toNumber(),
        authoredBy: authoredBy.toString(),
        startDateTime: new Date(startDateTime.toNumber()).toISOString(),
        hash: hash.toHex(),
      } as BlockNumberCreateInput);

      l.log(`Prisma Block Number: ${JSON.stringify(write)}`);
    }
  },
};

export default createBlockNumber;
