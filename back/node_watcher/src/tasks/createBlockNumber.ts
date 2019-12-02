// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType } from '@polkadot/types';
import { BlockNumber, Hash, Moment } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma, BlockNumberCreateInput } from '../../generated/prisma-client';
import { NomidotBlock, Task } from './types';
import BN = require('bn.js');

const l = logger('Task: BlockNumber');

/*
 *  ======= Table (BlockNumber) ======
 */
const createBlockNumber: Task<NomidotBlock> = {
  name: 'createBlockNumber',
  read: async (
    blockNumber: BlockNumber,
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotBlock> => {
    const [author, number] = await api.derive.chain.getHeader(
      blockHash.toHex()
    );

    const startDateTime: Moment = await api.query.timestamp.now.at(blockHash);

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
      number: blockNumber.toString(),
      authoredBy: authoredBy.toString(),
      startDateTime: new Date(startDateTime.mul(new BN(1000)).toNumber()).toISOString(),
      hash: hash.toHex()
    } as BlockNumberCreateInput;

    l.warn(`block number create input: ${JSON.stringify(blockNumberCreateInput)}`);

    await prisma.createBlockNumber(blockNumberCreateInput);
  }
};

export default createBlockNumber;
