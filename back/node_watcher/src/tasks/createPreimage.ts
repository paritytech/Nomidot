// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Bytes, GenericCall, Option } from '@polkadot/types';
import {
  AccountId,
  Balance,
  BlockNumber,
  Hash,
  PreimageStatus,
  Proposal,
} from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';
import { logger } from '@polkadot/util';

import { prisma, Motion as PrismaMotion, Proposal as PrismaProposal, Referendum as PrismaReferendum } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { preimageStatus } from '../util/statuses';
import {
  Cached,
  NomidotPreimage,
  NomidotPreimageEvent,
  NomidotPreimageRawEvent,
  Task,
} from './types';

type PreimageInfo = [Bytes, AccountId, Balance, BlockNumber];
type OldPreimage = ITuple<PreimageInfo>;

const l = logger('Task: Preimage');

const isCurrentPreimage = function(
  api: ApiPromise,
  imageOpt: Option<OldPreimage> | Option<PreimageStatus>
): imageOpt is Option<PreimageStatus> {
  return !!imageOpt && !api.query.democracy.dispatchQueue;
};

let proposal: Proposal | undefined;

const constructProposal = function(
  api: ApiPromise,
  bytes: Bytes
): Proposal | undefined {
  let proposal: Proposal | undefined;

  try {
    proposal = api.registry.createType('Proposal', bytes.toU8a(true));
  } catch (error) {
    l.log(error);
  }

  return proposal;
};

/*
 *  ======= Table (Preimage) ======
 */
const createPreimage: Task<NomidotPreimage[]> = {
  name: 'createPreimage',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotPreimage[]> => {
    const { events } = cached;

    let preimageEvents = filterEvents(
      events,
      'democracy',
      preimageStatus.NOTED
    );

    const results: NomidotPreimage[] = [];
    await Promise.all(
      preimageEvents.map(async ({ event }) => {
        let types = event.typeDef;

        let preimageArgumentsRaw: NomidotPreimageRawEvent | null = event.data.reduce(
          (prev, curr, index) => {
            const type = types[index].type;

            return {
              ...prev,
              [type]: curr.toString(),
            };
          },
          {}
        );

        if (
          !preimageArgumentsRaw.Hash ||
          !preimageArgumentsRaw.Balance ||
          !preimageArgumentsRaw.AccountId
        ) {
          l.error(
            `At least one of preimageArgumentsRaw: Hash, Balance or AccountId missing: ${preimageArgumentsRaw.Hash}, ${preimageArgumentsRaw.Balance}, ${preimageArgumentsRaw.AccountId}`
          );
          return null;
        }

        let preimageArguments: NomidotPreimageEvent = {
          hash: preimageArgumentsRaw.Hash,
          depositAmount: preimageArgumentsRaw.Balance,
          author: preimageArgumentsRaw.AccountId,
        };

        let preimageRaw: Option<PreimageStatus> | null = await api.query.democracy.preimages.at(
          blockHash,
          preimageArguments.hash
        );

        let preimage = preimageRaw!.unwrapOr(null);

        if (!preimage) {
          l.log(
            `No pre-image found for the pre-image hash ${preimageArguments.hash}`
          );
          return null;
        }

        if (preimage.isMissing) {
          l.log(
            `The preimage status is missing for preimage hash ${preimageArguments.hash}`
          );
          return null;
        }

        if (isCurrentPreimage(api, preimageRaw!)) {
          const { data } = preimage.asAvailable;

          proposal = constructProposal(api, data);
        } else {
          const [bytes] = (preimage as unknown) as OldPreimage;
          proposal = constructProposal(api, bytes);
        }

        if (!proposal) {
          l.log(
            `The proposal is missing for preimage hash ${preimageArguments.hash}`
          );
          return null;
        }

        const { meta, method, section } = api.registry.findMetaCall(
          proposal.callIndex
        );

        let params: string[] | null = GenericCall.filterOrigin(proposal.meta).map(({ name }) =>
          name.toString()
        );
        let values = proposal.args;

        let preImageArguments: any =
          proposal.args &&
          params &&
          params.map((name, index) => {
            return { name, value: values[index].toString() };
          });

        // FIXME any
        let result: any = {
          author: preimageArguments.author,
          depositAmount: preimageArguments.depositAmount,
          hash: preimageArguments.hash,
          metaDescription: meta.documentation.toString(),
          method,
          preImageArguments,
          section,
          status: preimageStatus.NOTED,
        };

        results.push(result);
        l.log(`Nomidot Preimage: ${JSON.stringify(result)}`);

        // explicitly clean references
        result = null;
        params = null;
        preimage = null;
        preimageRaw = null;
        preImageArguments = null;
        preimageArgumentsRaw = null;
      })
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotPreimage[]) => {
    await Promise.all(
      value.map(async prop => {
        const {
          author,
          depositAmount,
          hash: h,
          metaDescription,
          method,
          preImageArguments: pA,
          section,
          status,
        } = prop;

        let motion: PrismaMotion[] | null = await prisma.motions({
          where: { preimageHash: h.toString() },
          orderBy: 'motionProposalId_DESC',
        });

        let proposals: PrismaProposal[] | null = await prisma.proposals({
          where: { preimageHash: h.toString() },
          orderBy: 'proposalId_DESC',
        });

        let referenda: PrismaReferendum[] | null = await prisma.referendums({
          where: { preimageHash: h.toString() },
          orderBy: 'referendumId_DESC',
        });

        let m = motion[0];
        let p = proposals[0];
        let r = referenda[0];

        await prisma.createPreimage({
          author: author.toString(),
          depositAmount: depositAmount.toString(),
          hash: h.toString(),
          metaDescription,
          method,
          motion: m
            ? {
                connect: {
                  id: m.id,
                },
              }
            : null,
          proposal: p
            ? {
                connect: {
                  id: p.id,
                },
              }
            : null,
          preimageArguments: {
            create: pA,
          },
          preimageStatus: {
            create: {
              blockNumber: {
                connect: {
                  number: blockNumber.toNumber(),
                },
              },
              status,
            },
          },
          referendum: r
            ? {
                connect: {
                  id: r.id,
                },
              }
            : null,
          section,
        });

        // explicitly clean references
        motion = null;
        proposals = null;
        referenda = null;
      })
    );
  },
};

export default createPreimage;
