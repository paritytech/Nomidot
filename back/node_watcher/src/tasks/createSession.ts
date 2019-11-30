// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';

import { prisma } from '../../generated/prisma-client';
import { NomidotSession, Task } from './types';

/*
 *  ======= Table (Session) ======
 */
const createSession: Task<NomidotSession> = {
  read: async (
    blockNumber: BlockNumber,
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotSession> => {
    // check events for if a new session has happened.
    // Question: is there a better way to do this?
    const events = await api.query.system.events.at(blockHash);

    const didNewSessionStart =
      events.filter(
        ({ event: { method, section } }): boolean =>
          section === 'system' && method === 'newSession'
      ).length > 0;

    const sessionIndex = await api.query.session.currentIndex.at(blockHash);

    return {
      didNewSessionStart,
      idx: sessionIndex,
      blockNumber,
    };
  },
  write: async (value: NomidotSession) => {
    const { blockNumber, didNewSessionStart, idx } = value;

    if (didNewSessionStart) {
      await prisma.updateSession({
        data: {
          end: {
            connect: {
              number: blockNumber.toNumber(),
            },
          },
        },
        where: {
          id: idx.toNumber(),
        },
      });
    } else {
      const sessionCreateInput = {
        id: idx.toNumber(),
        start: {
          connect: {
            number: blockNumber.toNumber(),
          },
        },
        end: null,
      };

      await prisma.createSession(sessionCreateInput);
    }
  },
};

export default createSession;
