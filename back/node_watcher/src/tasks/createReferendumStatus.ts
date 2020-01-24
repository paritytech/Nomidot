// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import {
  NomidotProposalRawEvent,
  NomidotProposalStatusUpdate,
  ProposalStatus,
  Task,
} from './types';

const l = logger('Task: Referendum Status Update');

/*
 *  ======= Table (Proposal Status Update) ======
 */
const createProposal: Task<NomidotProposalStatusUpdate[]> = {
  name: 'createProposalStatusUpdate',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotProposalStatusUpdate[]> => {
    const events = await api.query.system.events.at(blockHash);

    const proposalEvents = events.filter(
      ({ event: { method, section } }) =>
        section === 'democracy' && method === ProposalStatus.TABLED
    );

    const results: NomidotProposalStatusUpdate[] = [];

    await Promise.all(
      proposalEvents.map(async ({ event: { data, typeDef } }) => {
        const proposalRawEvent: NomidotProposalRawEvent = data.reduce(
          (prev, curr, index) => {
            const type = typeDef[index].type;

            return {
              ...prev,
              [type]: curr.toString(),
            };
          },
          {}
        );

        if (!proposalRawEvent.PropIndex) {
          l.error(
            `Expected PropIndex not foung on the event: ${proposalRawEvent.PropIndex}`
          );
          return null;
        }

        const relatedProposal = await prisma.proposal({
          proposalId: Number(proposalRawEvent.PropIndex),
        });

        if (!relatedProposal) {
          l.error(
            `No existing proposal found for Proposal id: ${proposalRawEvent.PropIndex}`
          );
          return null;
        }

        const result: NomidotProposalStatusUpdate = {
          proposalId: Number(proposalRawEvent.PropIndex),
          status: ProposalStatus.TABLED,
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
        });
      })
    );
  },
};

export default createProposal;
