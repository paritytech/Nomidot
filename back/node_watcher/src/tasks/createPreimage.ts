// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { GenericCall } from '@polkadot/types';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { preimageStatus } from '../util/statuses';
import {
  Cached,
  NomidotPreimage,
  NomidotPreimageEvent,
  NomidotPreimageRawEvent,
  Task,
} from './types';

const l = logger('Task: Preimage');

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

    const preimageEvents = filterEvents(
      events,
      'democracy',
      preimageStatus.NOTED
    );

    const results: NomidotPreimage[] = [];
    await Promise.all(
      preimageEvents.map(async ({ event }) => {
        const types = event.typeDef;

        const preimageArgumentsRaw: NomidotPreimageRawEvent = event.data.reduce(
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

        const preimageArguments: NomidotPreimageEvent = {
          hash: preimageArgumentsRaw.Hash,
          depositAmount: preimageArgumentsRaw.Balance,
          author: preimageArgumentsRaw.AccountId,
        };

        const preimageRaw = await api.query.democracy.preimages.at(
          blockHash,
          preimageArguments.hash
        );
        const preimage = preimageRaw.unwrapOr(null);

        if (!preimage) {
          l.log(
            `No pre-image found for the pre-image hash ${preimageArguments.hash}`
          );
          return null;
        }

        const proposal = api.createType('Proposal', preimage[0].toU8a(true));

        const { meta, method, section } = api.registry.findMetaCall(
          proposal.callIndex
        );

        const params = GenericCall.filterOrigin(proposal.meta).map(({ name }) =>
          name.toString()
        );
        const values = proposal.args;

        const preImageArguments =
          proposal.args &&
          params &&
          params.map((name, index) => {
            return { name, value: values[index].toString() };
          });

        const result = {
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
      })
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotPreimage[]) => {
    await Promise.all(
      value.map(async (prop) => {
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

        const motion = await prisma.motions({
          where: { preimageHash: h.toString() },
          orderBy: 'motionProposalId_DESC',
        });

        const proposals = await prisma.proposals({
          where: { preimageHash: h.toString() },
          orderBy: 'proposalId_DESC',
        });

        const referenda = await prisma.referendums({
          where: { preimageHash: h.toString() },
          orderBy: 'referendumId_DESC',
        });

        const m = motion[0];
        const p = proposals[0];
        const r = referenda[0];

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
      })
    );
  },
};

export default createPreimage;
