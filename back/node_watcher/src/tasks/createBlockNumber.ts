// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, TypeRegistry } from '@polkadot/types';
import { BlockNumber, Hash, Moment } from '@polkadot/types/interfaces';

import { prisma } from '../../generated/prisma-client';
import { NomidotBlock, Task } from './types';

/*
 *  ======= Table (BlockNumber) ======
 */
const createBlockNumber: Task<NomidotBlock> = {
  read: async (
    blockNumber: BlockNumber,
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotBlock> => {
    const [author, number] = await api.derive.chain.getHeader(
      blockHash.toHex()
    );

    console.log(author, number);

    const startDateTime: Moment = await api.query.timestamp.now.at(blockHash);

    console.log(startDateTime);

    const result: NomidotBlock = {
      authoredBy: createType(api.registry, 'AccountId', author),
      blockNumber,
      hash: blockHash,
      startDateTime,
    };

    return result;
  },
  write: async (value: NomidotBlock) => {
    const { authoredBy, blockNumber, hash, startDateTime } = value;

    const blockNumberCreateInput = {
      authoredBy: authoredBy.toHex(),
      number: blockNumber.toNumber(),
      hash: hash.toHex(),
      startDateTime: new Date(startDateTime.toNumber() * 1000).toISOString(),
    };

    console.log(`block number create input: ${JSON.stringify(blockNumberCreateInput)}`);

    await prisma.createBlockNumber(blockNumberCreateInput);
  },
};

export default createBlockNumber;
