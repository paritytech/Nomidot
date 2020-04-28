// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { GenericCall } from '@polkadot/types';
import { BlockNumber, EventRecord, Hash, Proposal } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma, Preimage, TreasurySpendProposal } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { motionStatus, preimageStatus } from '../util/statuses';
import {
  Cached,
  NomidotArgument,
  NomidotMotion,
  NomidotMotionRawEvent,
  Task,
} from './types';

const l = logger('Task: Motions');

/*
 *  ======= Table (Motion) ======
 */
const createMotion: Task<NomidotMotion[]> = {
  name: 'createMotion',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotMotion[]> => {
    const { events } = cached;

    let motionEvents: EventRecord[] | null = filterEvents(events, 'council', motionStatus.PROPOSED);

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

        let motionProposalRaw = await api.query.council.proposalOf.at(
          blockHash,
          motionRawEvent.Hash
        );

        let motionProposal = motionProposalRaw.unwrapOr(null);

        if (!motionProposal) {
          l.log(`No motionProposal found for the hash ${motionRawEvent.Hash}`);
          return;
        }

        let proposal: Proposal | null = api.createType('Proposal', motionProposal);

        const { meta, method, section } = api.registry.findMetaCall(
          proposal.callIndex
        );

        let params: string[] | null = GenericCall.filterOrigin(proposal.meta).map(({ name }) =>
          name.toString()
        );
        let values = proposal.args;
        let preimageHash: string | null = null;

        const motionProposalArguments: NomidotArgument[] = [];

        proposal.args &&
          params &&
          params.forEach((name, index) => {
            motionProposalArguments.push({
              name,
              value: values[index].toString(),
            });

            if (name === 'proposal_hash') {
              preimageHash = values[index].toString();
            }
          });

        let result: NomidotMotion | null = {
          author: motionRawEvent.AccountId,
          memberCount: motionRawEvent.MemberCount,
          metaDescription: meta.documentation.toString(),
          method,
          motionProposalHash: motionRawEvent.Hash,
          motionProposalId: motionRawEvent.ProposalIndex,
          motionProposalArguments,
          preimageHash,
          section,
          status: motionStatus.PROPOSED,
        };

        l.log(`Nomidot Motion: ${JSON.stringify(result)}`);
        results.push(result);

        // explicitly clean references
        params = null;
        proposal = null;
        preimageHash = null;
        result = null;
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
          preimageHash,
          section,
          status,
        } = prop;

        let preimages = preimageHash
          ? await prisma.preimages({
              where: { hash: preimageHash.toString() },
            })
          : null;

        // preimage aren't uniquely identified with their hash
        // however, there can only be one preimage with the status "Noted"
        // at a time
        let notedPreimage: Preimage | null = preimages?.length
          ? preimages.filter(async preimage => {
              await prisma.preimageStatuses({
                where: {
                  AND: [{ id: preimage.id }, { status: preimageStatus.NOTED }],
                },
              });
            })[0]
          : null;

        let treasurySpendProposals: TreasurySpendProposal[] | null =
          section === 'treasury' &&
          mPA.length > 0 &&
          mPA[0].name === 'proposal_id'
            ? await prisma.treasurySpendProposals({
                where: { treasuryProposalId: parseInt(mPA[0].value) },
              })
            : [];

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
          preimage: notedPreimage
            ? {
                connect: {
                  id: notedPreimage.id,
                },
              }
            : null,
          preimageHash,
          treasurySpendProposal:
            treasurySpendProposals?.length > 0
              ? {
                  connect: {
                    id: treasurySpendProposals[0].id,
                  },
                }
              : null,
          section,
          motionStatus: {
            create: {
              blockNumber: {
                connect: {
                  number: blockNumber.toNumber(),
                },
              },
              status,
              uniqueStatus: `${motionProposalId}_${status}`,
            },
          },
        });

        // explicitly clean references
        preimages = null;
        notedPreimage = null;
        treasurySpendProposals = null;
      })
    );
  },
};

export default createMotion;
