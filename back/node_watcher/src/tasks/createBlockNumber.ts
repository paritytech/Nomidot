// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { HeaderExtended } from '@polkadot/api-derive';
import { createType } from '@polkadot/types';
import { BlockNumber, Hash, Moment } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { BlockNumberCreateInput, BlockNumber as PrismaBlockNumber, prisma } from '../generated/prisma-client';
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
    let headerExtended: HeaderExtended | undefined | null = await api.derive.chain.getHeader(blockHash);

    let startDateTime: Moment | null = await api.query.timestamp.now.at(blockHash);

    let result: NomidotBlock = {
      authoredBy: createType(api.registry, 'AccountId', headerExtended!.author),
      hash: blockHash,
      startDateTime: startDateTime!,
    };

    l.log(`NomidotBlock: ${JSON.stringify(result)}`);

    // explicitly dereference
    headerExtended = null;
    startDateTime = null;

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

    let write: PrismaBlockNumber | null = await prisma.createBlockNumber({
      number: blockNumber.toNumber(),
      authoredBy: authoredBy.toString(),
      startDateTime: new Date(startDateTime.toNumber()).toISOString(),
      hash: hash.toHex(),
    } as BlockNumberCreateInput);

    l.log(`Prisma Block Number: ${JSON.stringify(write)}`);

    // explicitly dereference
    write = null;
  },
};

export default createBlockNumber;
