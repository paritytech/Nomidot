// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType } from '@polkadot/types';
import { BlockNumber, Hash, Moment } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../../generated/prisma-client';
import { NomidotBlock, Task } from './types';

const l = logger('Task: BlockNumber');

/*
 *  ======= Table (BlockNumber) ======
 */
const createBlockNumber: Task<NomidotBlock> = {
  name: 'createBlockNumber',
  read: async (blockHash: Hash, api: ApiPromise): Promise<NomidotBlock> => {
    const [author] = await api.derive.chain.getHeader(blockHash.toHex());

    const startDateTime: Moment = await api.query.timestamp.now.at(blockHash);

    const result: NomidotBlock = {
      authoredBy: createType(api.registry, 'AccountId', author),
      hash: blockHash,
      startDateTime,
    };

    l.log(`NomidotBlock: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotBlock) => {
    const { authoredBy, hash, startDateTime } = value;

    const write = await prisma.createBlockNumber({
      number: blockNumber.toNumber(),
      authoredBy: authoredBy.toHex(),
      startDateTime: new Date(startDateTime.toNumber() * 1000).toISOString(),
      hash: hash.toHex(),
    });

    l.log(`Prisma Block Number: ${write}`);
  },
};

export default createBlockNumber;
