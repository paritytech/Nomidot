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
import {
  NomidotProposal,
  NomidotProposalEvent,
  NomidotProposalRawEvent,
  PreimageStatus,
  ProposalStatus,
  ReferendumStatus,
  Task,
} from './types';

const l = logger('Task: Referenda');

/*
 *  ======= Table (Referendum) ======
 */
const createProposal: Task<NomidotProposal[]> = {
  name: 'createProposal',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotProposal[]> => {
    const events = await api.query.system.events.at(blockHash);

    const proposalEvents = events.filter(
      ({ event: { method, section } }) =>
        section === 'democracy' && method === ReferendumStatus.STARTED
    );

    const results: NomidotProposal[] = [];

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
        // Returns { ReferendumIndex: '0', VoteThreshold: 'Supermajorityapproval' }

        if (!proposalRawEvent.PropIndex || !proposalRawEvent.Balance) {
          l.error(
            `At least one of proposalArgumentRaw: PropIndex or Balance missing: ${proposalRawEvent.PropIndex}, ${proposalRawEvent.Balance}`
          );
          return null;
        }

        const proposalArguments: NomidotProposalEvent = {
          depositAmount: proposalRawEvent.Balance,
          proposalId: Number(proposalRawEvent.PropIndex),
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
          status: ProposalStatus.PROPOSED,
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

        const preimages =
          preimageHash &&
          (await prisma.preimages({
            where: { hash: preimageHash.toString() },
          }));

        // preimage aren't uniquely identified with their hash
        // however, there can only be one preimage with the status "Noted"
        // at a time
        const p = preimages.length
          ? preimages?.filter(async preimage => {
              await prisma
                .preimage({ id: preimage.id })
                .preimageStatus({ where: { status: PreimageStatus.NOTED } });
            })[0]
          : undefined;

        await prisma.createProposal({
          author: author.toString(),
          depositAmount: depositAmount.toString(),
          preimage: p
            ? {
                connect: {
                  id: p?.id,
                },
              }
            : undefined,
          preimageHash: preimageHash.toString(),
          proposalId: Number(proposalId),
          proposalStatus: {
            create: {
              blockNumber: {
                connect: {
                  number: blockNumber.toNumber(),
                },
              },
              status,
            },
          },
        });
      })
    );
  },
};

export default createProposal;
