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
import { motionStatus, preimageStatus } from '../util/statuses';
import {
  NomidotMotion,
  NomidotMotionEvent,
  NomidotMotionRawEvent,
  Task,
} from './types';

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
        section === 'council' || section === 'democracy'
      // && method === motionStatus.PROPOSED
    );

    const results: NomidotMotion[] = [];

    await Promise.all(
      motionEvents.map(({ event: { data, method, typeDef } }) => {
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
        console.log('event', method);
        console.log('motionRawEvent', JSON.stringify(motionRawEvent, null, 4));
        //   motionRawEvent {
        //     "AccountId": "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
        //     "ProposalIndex": 0,
        //     "Hash": "0x70d3993e2625d550bc752ded1d3fff18be9731f84925a27040fdb0562149b053",
        //     "MemberCount": 2
        // }

        //   if (!motionRawEvent.PropIndex && motionRawEvent.PropIndex !== 0) {
        //     l.error(
        //       `Expected PropIndex missing on the event: ${motionRawEvent.PropIndex}`
        //     );
        //     return null;
        //   }

        //   if (!motionRawEvent.Balance) {
        //     l.error(
        //       `Expected Balance missing on the event: ${motionRawEvent.Balance}`
        //     );
        //     return null;
        //   }

        //   const motionArguments: NomidotMotionEvent = {
        //     depositAmount: motionRawEvent.Balance,
        //     motionId: motionRawEvent.PropIndex,
        //   };

        //   const publicProps = await api.query.democracy.publicProps.at(blockHash);

        //   const [, preimageHash, author] = publicProps.filter(
        //     ([idNumber]: [PropIndex, Hash, AccountId]) =>
        //       idNumber.toNumber() === motionArguments.motionId
        //   )[0];

        //   const result: NomidotMotion = {
        //     author,
        //     depositAmount: motionArguments.depositAmount,
        //     motionId: motionArguments.motionId,
        //     preimageHash,
        //     status: motionStatus.PROPOSED,
        //   };

        //   l.log(`Nomidot Motion: ${JSON.stringify(result)}`);
        //   results.push(result);
      })
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotMotion[]) => {
    await Promise.all(
      value.map(async prop => {
        // const { author, depositAmount, preimageHash, status } = prop;
        // const preimages = await prisma.preimages({
        //   where: { hash: preimageHash.toString() },
        // });
        // // preimage aren't uniquely identified with their hash
        // // however, there can only be one preimage with the status "Noted"
        // // at a time
        // const notedPreimage =
        //   preimages.length &&
        //   preimages.filter(async preimage => {
        //     await prisma.preimageStatuses({
        //       where: {
        //         AND: [{ id: preimage.id }, { status: preimageStatus.NOTED }],
        //       },
        //     });
        //   })[0];
        // await prisma.createMotion({
        //   author: author.toString(),
        //   depositAmount: depositAmount.toString(),
        //   preimage: notedPreimage
        //     ? {
        //         connect: {
        //           id: notedPreimage.id,
        //         },
        //       }
        //     : undefined,
        //   preimageHash: preimageHash.toString(),
        //   motionId,
        //   motionStatus: {
        //     create: {
        //       blockNumber: {
        //         connect: {
        //           number: blockNumber.toNumber(),
        //         },
        //       },
        //       status,
        //     },
        //   },
        // });
      })
    );
  },
};

export default createMotion;
