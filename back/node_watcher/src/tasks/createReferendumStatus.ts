// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import {
  NomidotReferendumRawEvent,
  NomidotReferendumStatusUpdate,
  referendumStatus,
  Task,
} from './types';

const l = logger('Task: Referendum Status Update');

/*
 *  ======= Table (Proposal Status Update) ======
 */
const createProposal: Task<NomidotReferendumStatusUpdate[]> = {
  name: 'createProposalStatusUpdate',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotReferendumStatusUpdate[]> => {
    const events = await api.query.system.events.at(blockHash);

    // The "Started" event is taken care of by the createReferendum
    // task, so we need to filter it out.
    const referendumEvents = events.filter(
      ({ event: { method, section } }) =>
        section === 'democracy' &&
        Object.values(referendumStatus)
          .filter(status => status !== referendumStatus.STARTED)
          .includes(method)
    );

    const results: NomidotReferendumStatusUpdate[] = [];

    await Promise.all(
      referendumEvents.map(async ({ event: { data, typeDef, method } }) => {
        const referendumRawEvent: NomidotReferendumRawEvent = data.reduce(
          (prev, curr, index) => {
            const type = typeDef[index].type;
            return {
              ...prev,
              [type]: curr.toString(),
            };
          },
          {}
        );
        if (!referendumRawEvent.ReferendumIndex) {
          l.error(
            `Expected ReferendumIndex not found on the event: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }

        const relatedReferendum = await prisma.referendum({
          referendumId: Number(referendumRawEvent.ReferendumIndex),
        });

        if (!relatedReferendum) {
          l.error(
            `No existing referendum found for referendum id: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }

        const result: NomidotReferendumStatusUpdate = {
          referendumId: Number(referendumRawEvent.ReferendumIndex),
          status: method,
        };
        l.log(`Nomidot Referendum Status Update: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (
    blockNumber: BlockNumber,
    value: NomidotReferendumStatusUpdate[]
  ) => {
    await Promise.all(
      value.map(async prop => {
        const { referendumId: rId, status } = prop;

        await prisma.createReferendumStatus({
          blockNumber: {
            connect: {
              number: blockNumber.toNumber(),
            },
          },
          referendum: {
            connect: {
              referendumId: rId,
            },
          },
          status,
        });
      })
    );
  },
};

export default createProposal;
