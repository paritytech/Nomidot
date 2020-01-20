// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, GenericCall } from '@polkadot/types';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import {
  NomidotPreimage,
  NomidotPreimageEvent,
  NomidotPreimageRawEvent,
  PreimageStatus,
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
    api: ApiPromise
  ): Promise<NomidotPreimage[]> => {
    const events = await api.query.system.events.at(blockHash);

    const preimageEvents = events.filter(
      ({ event: { method, section } }) =>
        section === 'democracy' && method === 'PreimageNoted'
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
            `At least one of preimageArgumentsRaw: Hash, Balance or AccountId missing. ${preimageArgumentsRaw.Hash}, ${preimageArgumentsRaw.Balance}, ${preimageArgumentsRaw.AccountId}`
          );
          return null;
        }

        const preimageArguments: NomidotPreimageEvent = {
          hash: preimageArgumentsRaw.Hash,
          depositAmount: preimageArgumentsRaw.Balance,
          author: preimageArgumentsRaw.AccountId,
        };

        console.log(`method: ${event.method}, section: ${event.section}`);
        console.log(
          `PreimageEventArguments: ${JSON.stringify(preimageArguments)}`
        );

        const preimageRaw = await api.query.democracy.preimages(
          preimageArguments.hash
        );
        const preimage = preimageRaw.unwrapOr(null);

        if (!preimage) {
          l.log(
            `No pre-image found for the pre-image hash ${preimageArguments.hash}`
          );
          return null;
        }

        const proposal = createType(
          api.registry,
          'Proposal',
          preimage[0].toU8a(true)
        );

        if (!proposal) {
          l.log(
            `No proposal found associated to the pre-image hash ${preimageArguments.hash}`
          );
          return null;
        }

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
          metaDescription: meta?.documentation.toString(),
          method,
          preImageArguments,
          section,
          status: PreimageStatus.NOTED,
        };

        results.push(result);
        l.log(`Nomidot Preimage: ${JSON.stringify(result)}`);
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

        if (!h) return;

        const proposals = await prisma.proposals({
          where: { preimage: { hash: h.toString() } },
          orderBy: 'id_DESC',
        });

        const p = proposals[0];

        await prisma.createPreimage({
          author: author.toString(),
          depositAmount: depositAmount?.toString(),
          hash: h.toString(),
          preimageArguments: {
            create: pA,
          },
          proposal: {
            connect: p,
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
          metaDescription,
          method,
          section,
        });
      })
    );
  },
};

export default createPreimage;
