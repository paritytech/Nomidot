// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { Cached, NomidotSession, Task } from './types';

const l = logger('Task: Session');

/*
 *  ======= Table (Session) ======
 */
const createSession: Task<NomidotSession> = {
  name: 'createSession',
  read: (
    _blockHash: Hash,
    cached: Cached,
    _api: ApiPromise
  ): Promise<NomidotSession> => {
    const { sessionIndex } = cached;

    const result = {
      idx: sessionIndex,
    };

    l.log(`Nomidot Session: ${JSON.stringify(result)}`);

    return Promise.resolve(result);
  },
  write: async (blockNumber: BlockNumber, value: NomidotSession) => {
    const { idx } = value;

    const exists = await prisma.$exists.session({ index: idx.toNumber() });

    if (!exists) {
      await prisma.createSession({
        index: idx.toNumber(),
        start: {
          connect: {
            number: blockNumber.toNumber(),
          },
        },
      });
    }
  },
};

export default createSession;
