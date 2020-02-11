// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { GenericCall } from '@polkadot/types';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { motionStatus } from '../util/statuses';
import { NomidotMotion, NomidotMotionRawEvent, Task } from './types';

const l = logger('Task: Motions');

/*
 *  ======= Table (Motion) ======
 */
const createMotion: Task<NomidotMotion[]> = {
  name: 'createMotion',
  read: async (blockHash: Hash, api: ApiPromise): Promise<NomidotMotion[]> => {
    const events = await api.query.system.events.at(blockHash);

    const motionEvents = events.filter(
      ({ event: { method, section } }) =>
        section === 'council' && method === motionStatus.PROPOSED
    );

    const results: NomidotMotion[] = [];

    await Promise.all(
      motionEvents.map(async ({ event: { data, typeDef } }) => {
        const motionRawEvent: NomidotMotionRawEvent = data.reduce(
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
          !motionRawEvent.ProposalIndex &&
          motionRawEvent.ProposalIndex !== 0
        ) {
          l.error(
            `Expected ProposalIndex missing on the event: ${motionRawEvent.ProposalIndex}`
          );
          return;
        }

        if (!motionRawEvent.AccountId) {
          l.error(
            `Expected AccountId missing on the event: ${motionRawEvent.AccountId}`
          );
          return;
        }

        if (!motionRawEvent.Hash) {
          l.error(`Expected Hash missing on the event: ${motionRawEvent.Hash}`);
          return;
        }

        if (!motionRawEvent.MemberCount) {
          l.error(
            `Expected MemberCount missing on the event: ${motionRawEvent.MemberCount}`
          );
          return;
        }

        const motionProposalRaw = await api.query.council.proposalOf.at(
          blockHash,
          motionRawEvent.Hash
        );

        const motionProposal = motionProposalRaw.unwrapOr(null);

        if (!motionProposal) {
          l.log(`No motionProposal found for the hash ${motionRawEvent.Hash}`);
          return;
        }

        const proposal = api.createType('Proposal', motionProposal);

        const { meta, method, section } = api.registry.findMetaCall(
          proposal.callIndex
        );

        const params = GenericCall.filterOrigin(proposal.meta).map(({ name }) =>
          name.toString()
        );
        const values = proposal.args;

        const motionProposalArguments =
          proposal.args &&
          params &&
          params.map((name, index) => {
            return { name, value: values[index].toString() };
          });

        const result: NomidotMotion = {
          author: motionRawEvent.AccountId,
          memberCount: motionRawEvent.MemberCount,
          metaDescription: meta.documentation.toString(),
          method,
          motionProposalHash: motionRawEvent.Hash,
          motionProposalId: motionRawEvent.ProposalIndex,
          motionProposalArguments,
          section,
          status: motionStatus.PROPOSED,
        };

        l.log(`Nomidot Motion: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotMotion[]) => {
    await Promise.all(
      value.map(async prop => {
        const {
          author,
          memberCount,
          metaDescription,
          method,
          motionProposalArguments: mPA,
          motionProposalHash,
          motionProposalId,
          section,
          status,
        } = prop;

        await prisma.createMotion({
          author: author.toString(),
          memberCount,
          metaDescription,
          method,
          motionProposalArguments: {
            create: mPA,
          },
          motionProposalHash: motionProposalHash.toString(),
          motionProposalId,
          section,
          status: {
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

export default createMotion;
