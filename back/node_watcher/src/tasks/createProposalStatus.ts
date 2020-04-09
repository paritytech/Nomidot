// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { proposalStatus } from '../util/statuses';
import {
  Cached,
  NomidotProposalRawEvent,
  NomidotProposalStatusUpdate,
  Task,
} from './types';

const l = logger('Task: Proposals Status Update');

/*
 *  ======= Table (Proposal Status Update) ======
 */
const createProposal: Task<NomidotProposalStatusUpdate[]> = {
  name: 'createProposalStatusUpdate',
  read: async (
    _blockHash: Hash,
    cached: Cached,
    _api: ApiPromise
  ): Promise<NomidotProposalStatusUpdate[]> => {
    const { events } = cached;

    const proposalEvents = filterEvents(
      events,
      'democracy',
      proposalStatus.TABLED
    );

    const results: NomidotProposalStatusUpdate[] = [];

    if (!proposalEvents) {
      return results;
    }

    await Promise.all(
      proposalEvents.map(async ({ event: { data, typeDef } }) => {
        const proposalRawEvent: NomidotProposalRawEvent = data.reduce(
          (result, curr, index) => {
            const type = typeDef[index].type;

            return {
              ...result,
              [type]: curr.toJSON(),
            };
          },
          {}
        );

        if (!proposalRawEvent.PropIndex && proposalRawEvent.PropIndex !== 0) {
          l.error(
            `Expected PropIndex not found on the event: ${proposalRawEvent.PropIndex}`
          );
          return null;
        }

        const relatedProposal = await prisma.proposal({
          proposalId: proposalRawEvent.PropIndex,
        });

        if (!relatedProposal) {
          l.error(
            `No existing proposal found for Proposal id: ${proposalRawEvent.PropIndex}`
          );
          return null;
        }

        const result: NomidotProposalStatusUpdate = {
          proposalId: proposalRawEvent.PropIndex,
          status: proposalStatus.TABLED,
        };

        l.log(`Nomidot Proposal Status Update: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (
    blockNumber: BlockNumber,
    value: NomidotProposalStatusUpdate[]
  ) => {
    if (!value || !value.length) {
      return;
    }

    await Promise.all(
      value.map(async prop => {
        const { proposalId: pId, status } = prop;

        await prisma.createProposalStatus({
          blockNumber: {
            connect: {
              number: blockNumber.toNumber(),
            },
          },
          proposal: {
            connect: {
              proposalId: pId,
            },
          },
          status,
          uniqueStatus: `${pId}_${status}`,
        });
      })
    );
  },
};

export default createProposal;
