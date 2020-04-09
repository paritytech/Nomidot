// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { motionStatus } from '../util/statuses';
import {
  Cached,
  NomidotMotionRawEvent,
  NomidotMotionStatusUpdate,
  Task,
} from './types';

const l = logger('Task: Motions Status Update');

/*
 *  ======= Table (Motion Status Update) ======
 */
const createMotion: Task<NomidotMotionStatusUpdate[]> = {
  name: 'createMotionStatusUpdate',
  read: async (
    _blockHash: Hash,
    cached: Cached,
    _api: ApiPromise
  ): Promise<NomidotMotionStatusUpdate[]> => {
    const { events } = cached;
    // Proposed is handled by createMotion task
    // Voted should be handled by a vote tracking tasks
    const motionEvents = events.filter(
      ({ event: { method, section } }) =>
        section === 'council' &&
        method !== motionStatus.VOTED &&
        method !== motionStatus.PROPOSED
    );

    const results: NomidotMotionStatusUpdate[] = [];

    if (!motionEvents) {
      return results;
    }

    await Promise.all(
      motionEvents.map(async ({ event: { data, method, typeDef } }) => {
        const motionRawEvent: NomidotMotionRawEvent = data.reduce(
          (result, curr, index) => {
            const type = typeDef[index].type;

            return {
              ...result,
              [type]: curr.toJSON(),
            };
          },
          {}
        );

        if (!motionRawEvent.Hash) {
          l.error(
            `Expected Proposal Hash not found on the event: ${motionRawEvent.Hash}`
          );
          return null;
        }

        // Get the latest motion with this proposal hash
        // that is still active (hence not approved, disapproved..)
        const relatedMotions = await prisma.motions({
          where: {
            AND: [
              {
                motionProposalHash: motionRawEvent.Hash.toString(),
              },
              {
                // eslint-disable-next-line @typescript-eslint/camelcase
                motionStatus_every: {
                  // eslint-disable-next-line @typescript-eslint/camelcase
                  status_not_in: [
                    motionStatus.VOTED,
                    motionStatus.APPROVED,
                    motionStatus.DISAPPROVED,
                    motionStatus.EXECUTED,
                  ],
                },
              },
            ],
          },
        });

        const relatedMotion = relatedMotions[0];

        if (!relatedMotion) {
          l.error(
            `No existing motion found for Motion hash: ${motionRawEvent.Hash}`
          );
          return null;
        }

        const result: NomidotMotionStatusUpdate = {
          motionProposalId: relatedMotion.motionProposalId,
          status: method,
        };

        l.log(`Nomidot Motion Status Update: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (
    blockNumber: BlockNumber,
    value: NomidotMotionStatusUpdate[]
  ) => {
    if (!value || !value.length) {
      return;
    }

    await Promise.all(
      value.map(async prop => {
        const { motionProposalId: mPId, status } = prop;

        await prisma.createMotionStatus({
          blockNumber: {
            connect: {
              number: blockNumber.toNumber(),
            },
          },
          motion: {
            connect: {
              motionProposalId: mPId,
            },
          },
          status,
          uniqueStatus: `${mPId}_${status}`,
        });
      })
    );
  },
};

export default createMotion;
