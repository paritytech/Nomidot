// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, EventRecord, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma, Referendum as PrismaReferendum } from '../generated/prisma-client';
import { referendumStatus } from '../util/statuses';
import {
  Cached,
  NomidotReferendumRawEvent,
  NomidotReferendumStatusUpdate,
  Task,
} from './types';

const l = logger('Task: Referendum Status Update');

/*
 *  ======= Table (Referendum Status Update) ======
 */
const createReferendumStatus: Task<NomidotReferendumStatusUpdate[]> = {
  name: 'createReferendumStatusUpdate',
  read: async (
    _blockHash: Hash,
    cached: Cached,
    _api: ApiPromise
  ): Promise<NomidotReferendumStatusUpdate[]> => {
    const { events } = cached;

    // The "Started" event is taken care of by the createReferendum
    // task, so we need to filter it out.
    let referendumEvents: EventRecord[] | null = events.filter(
      ({ event: { method, section } }) =>
        section === 'democracy' &&
        Object.values(referendumStatus)
          .filter(status => status !== referendumStatus.STARTED)
          .includes(method)
    );

    const results: NomidotReferendumStatusUpdate[] = [];

    if (!referendumEvents) {
      return results;
    }

    await Promise.all(
      referendumEvents.map(async ({ event: { data, typeDef, method } }) => {
        let referendumRawEvent: NomidotReferendumRawEvent | null = data.reduce(
          (prev, curr, index) => {
            const type = typeDef[index].type;
            return {
              ...prev,
              [type]: curr.toJSON(),
            };
          },
          {}
        );

        if (
          !referendumRawEvent.ReferendumIndex &&
          referendumRawEvent.ReferendumIndex !== 0
        ) {
          l.error(
            `Expected ReferendumIndex not found on the event: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }

        let relatedReferendum: PrismaReferendum | null = await prisma.referendum({
          referendumId: referendumRawEvent.ReferendumIndex,
        });

        if (!relatedReferendum) {
          l.error(
            `No existing referendum found for referendum id: ${referendumRawEvent.ReferendumIndex}`
          );
          return [];
        }

        let result: NomidotReferendumStatusUpdate | null = {
          referendumId: referendumRawEvent.ReferendumIndex,
          status: method,
        };
        l.log(`Nomidot Referendum Status Update: ${JSON.stringify(result)}`);
        results.push(result);
        
        // explicitly clean references
        referendumRawEvent = null;
        relatedReferendum = null;
        result = null;
      })
    );
    
    // explicitly clean references
    referendumEvents = null;

    return results;
  },
  write: async (
    blockNumber: BlockNumber,
    value: NomidotReferendumStatusUpdate[]
  ) => {
    if (value && value.length) {
      await Promise.all(
        value.map(async ref => {
          const { referendumId, status } = ref;

          await prisma.createReferendumStatus({
            blockNumber: {
              connect: {
                number: blockNumber.toNumber(),
              },
            },
            referendum: {
              connect: {
                referendumId,
              },
            },
            status,
            uniqueStatus: `${referendumId}_${status}`,
          });
        })
      );
    }
  },
};

export default createReferendumStatus;
