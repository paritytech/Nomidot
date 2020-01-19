// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import {
  NomidotProposalEvent,
  NomidotProposalEventArgument,
  Task,
} from './types';

const l = logger('Task: ProposalStatus');

/*
 *  ======= Table (ProposalStatus) ======
 */
const createProposalEvent: Task<NomidotProposalEvent[]> = {
  name: 'createProposalEvent',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotProposalEvent[]> => {
    const events = await api.query.system.events.at(blockHash);

    const proposalEvents = events.filter(
      ({ event: { section, method } }) =>
        section === 'democracy' &&
        (method === ' Proposed' || method === 'Tabled')
    );

    const results: NomidotProposalEvent[] = [];

    // Loop through the Vec<EventRecord>
    proposalEvents.map(record => {
      // Extract the event and the event types
      const { event } = record;
      const types = event.typeDef;
      let propIndex = null;

      const proposalEventArguments: NomidotProposalEventArgument[] = event.data.map(
        (data, index) => {
          const type = types[index].type;

          if (type === 'PropIndex') {
            propIndex = Number(data);
          }

          return {
            type,
            data: data.toString(),
          };
        }
      );

      if (propIndex !== null) {
        const result = {
          method: event.method,
          proposalId: propIndex,
          proposalEventArguments,
        };

        results.push(result);
        l.log(`Nomidot ProposalEvent: ${JSON.stringify(result)}`);
      }
    });

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotProposalEvent[]) => {
    await Promise.all(
      value.map(async ({ method, proposalId, proposalEventArguments: pEA }) => {
        await prisma.createProposalEvent({
          blockNumber: {
            connect: {
              number: blockNumber.toNumber(),
            },
          },
          method,
          proposal: {
            connect: { proposalId },
          },
          proposalEventArguments: {
            create: pEA,
          },
        });
      })
    );
  },
};

export default createProposalEvent;
