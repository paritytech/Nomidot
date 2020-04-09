// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import {
  AccountId,
  BlockNumber,
  Hash,
  PropIndex,
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { preimageStatus, proposalStatus } from '../util/statuses';
import {
  Cached,
  NomidotProposal,
  NomidotProposalEvent,
  NomidotProposalRawEvent,
  Task,
} from './types';

const l = logger('Task: Proposals');

/*
 *  ======= Table (Proposal) ======
 */
const createProposal: Task<NomidotProposal[]> = {
  name: 'createProposal',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotProposal[]> => {
    const { events } = cached;
    const proposalEvents = filterEvents(
      events,
      'democracy',
      proposalStatus.PROPOSED
    );

    const results: NomidotProposal[] = [];

    await Promise.all(
      proposalEvents.map(async ({ event: { data, typeDef } }) => {
        const proposalRawEvent: NomidotProposalRawEvent = data.reduce(
          (prev, curr, index) => {
            const type = typeDef[index].type;

            return {
              ...prev,
              [type]: curr.toJSON(),
            };
          },
          {}
        );
        if (!proposalRawEvent.PropIndex && proposalRawEvent.PropIndex !== 0) {
          l.error(
            `Expected PropIndex missing on the event: ${proposalRawEvent.PropIndex}`
          );
          return null;
        }

        if (!proposalRawEvent.Balance) {
          l.error(
            `Expected Balance missing on the event: ${proposalRawEvent.Balance}`
          );
          return null;
        }

        const proposalArguments: NomidotProposalEvent = {
          depositAmount: proposalRawEvent.Balance,
          proposalId: proposalRawEvent.PropIndex,
        };

        const publicProps = await api.query.democracy.publicProps.at(blockHash);

        const [, preimageHash, author] = publicProps.filter(
          ([idNumber]: [PropIndex, Hash, AccountId]) =>
            idNumber.toNumber() === proposalArguments.proposalId
        )[0];

        const result: NomidotProposal = {
          author,
          depositAmount: proposalArguments.depositAmount,
          proposalId: proposalArguments.proposalId,
          preimageHash,
          status: proposalStatus.PROPOSED,
        };

        l.log(`Nomidot Proposal: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotProposal[]) => {
    await Promise.all(
      value.map(async prop => {
        const {
          author,
          depositAmount,
          proposalId,
          preimageHash,
          status,
        } = prop;

        const preimages = await prisma.preimages({
          where: { hash: preimageHash.toString() },
        });

        // preimage aren't uniquely identified with their hash
        // however, there can only be one preimage with the status "Noted"
        // at a time
        const notedPreimage =
          preimages.length &&
          preimages.filter(async preimage => {
            await prisma.preimageStatuses({
              where: {
                AND: [{ id: preimage.id }, { status: preimageStatus.NOTED }],
              },
            });
          })[0];

        await prisma.createProposal({
          author: author.toString(),
          depositAmount: depositAmount.toString(),
          preimage: notedPreimage
            ? {
                connect: {
                  id: notedPreimage.id,
                },
              }
            : undefined,
          preimageHash: preimageHash.toString(),
          proposalId,
          proposalStatus: {
            create: {
              blockNumber: {
                connect: {
                  number: blockNumber.toNumber(),
                },
              },
              status,
              uniqueStatus: `${proposalId}_${status}`,
            },
          },
        });
      })
    );
  },
};

export default createProposal;
