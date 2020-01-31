// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { preimageStatus, referendumStatus } from '../util/statuses';
import { NomidotReferendum, NomidotReferendumRawEvent, Task } from './types';

const l = logger('Task: Referenda');

/*
 *  ======= Table (Referendum) ======
 */
const createReferendum: Task<NomidotReferendum[]> = {
  name: 'createReferendum',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotReferendum[]> => {
    const events = await api.query.system.events.at(blockHash);

    const referendumEvents = events.filter(
      ({ event: { method, section } }) =>
        section === 'democracy' && method === referendumStatus.STARTED
    );

    const results: NomidotReferendum[] = [];

    await Promise.all(
      referendumEvents.map(async ({ event: { data, typeDef } }) => {
        const referendumRawEvent: NomidotReferendumRawEvent = data.reduce(
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

        if (
          !referendumRawEvent.ReferendumIndex ||
          !referendumRawEvent.VoteThreshold
        ) {
          l.error(
            `At least one of the expected ReferendumIndex or VoteThreshold is missing in the event: ${referendumRawEvent.ReferendumIndex}, ${referendumRawEvent.VoteThreshold}`
          );
          return null;
        }

        const referendumInfoRaw = await api.query.democracy.referendumInfoOf.at(
          blockHash,
          referendumRawEvent.ReferendumIndex
        );
        // democracy.referendumInfoOf: Option<ReferendumInfo>
        // {"end":180,"proposalHash":"0x6b41591e6cbb1c82eeb8370e29e09c4026450dc274869a333e6df95050d2b1cb","threshold":"supermajorityapproval","delay":60}

        const referendumInfo = referendumInfoRaw.unwrapOr(undefined);
        if (!referendumInfo) {
          l.error(
            `No ReferendumInfo found for ReferendumIndex: ${referendumRawEvent.ReferendumIndex}`
          );
          return null;
        }

        const result: NomidotReferendum = {
          delay: referendumInfo.delay,
          end: referendumInfo.end,
          preimageHash: referendumInfo.proposalHash,
          referendumIndex: referendumRawEvent.ReferendumIndex,
          status: referendumStatus.STARTED,
          voteThreshold: referendumRawEvent.VoteThreshold,
        };

        l.log(`Nomidot Referendum: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotReferendum[]) => {

    if(!value) {
      return;
    }

    await Promise.all(
      value.map(async prop => {
        const {
          delay,
          end,
          preimageHash,
          referendumIndex,
          status,
          voteThreshold,
        } = prop;

        const preimages = await prisma.preimages({
            where: {
              hash: preimageHash.toString()
            }
          });
        
        l.log(`PREIMAGES ${preimages}`);

        // preimage aren't uniquely identified with their hash
        // however, there can only be one preimage with the status "Noted"
        // at a time
        const p = 
          preimages.length
            ? preimages.filter(async preimage => {
                await prisma
                  .preimage({ id: preimage.id })
                  .preimageStatus({ where: { status: preimageStatus.NOTED } });
              })[0]
            : undefined;

        await prisma.createReferendum({
          delay: delay.toNumber(),
          end: end.toNumber(),
          preimage: p
            ? {
                connect: {
                  id: p?.id,
                },
              }
            : undefined,
          preimageHash: preimageHash.toString(),
          referendumId: Number(referendumIndex),
          referendumStatus: {
            create: {
              blockNumber: {
                connect: {
                  number: blockNumber.toNumber(),
                },
              },
              status,
            },
          },
          voteThreshold: voteThreshold.toString(),
        });
      })
    );
  },
};

export default createReferendum;
