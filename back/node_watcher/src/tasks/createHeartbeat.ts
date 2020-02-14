// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, EventRecord, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { Cached, NomidotHeartBeat, Task } from './types';

const l = logger('Task: HeartBeat');

/*
 *  ======= Table (HeartBeat) ======
 */
const createHeartBeat: Task<NomidotHeartBeat[]> = {
  name: 'createHeartBeat',
  read: (
    _blockHash: Hash,
    cached: Cached,
    _api: ApiPromise
  ): Promise<NomidotHeartBeat[]> => {
    const { events, sessionIndex } = cached;

    const heartbeatEvents: EventRecord[] = filterEvents(
      events,
      'imOnline',
      'HeartbeatReceived'
    );

    const result: NomidotHeartBeat[] = [];

    if (heartbeatEvents) {
      heartbeatEvents.map(({ event: { data } }) => {
        data.map(authorityId => {
          result.push({
            authorityId,
            sessionIndex,
          } as NomidotHeartBeat);
        });
      });
    }

    l.log(`Heartbeat: ${JSON.stringify(result)}`);

    return Promise.resolve(result);
  },
  write: async (blockNumber: BlockNumber, heartbeats: NomidotHeartBeat[]) => {
    await Promise.all(
      heartbeats.map(async ({ authorityId, sessionIndex }) => {
        await prisma.createHeartBeat({
          sessionIndex: {
            connect: {
              index: sessionIndex.toNumber(),
            },
          },
          authorityId: authorityId.toString(),
        });
      })
    );
  },
};

export default createHeartBeat;
