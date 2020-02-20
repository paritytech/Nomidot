// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType } from '@polkadot/types';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { Cached, NomidotTreasury, NomidotTreasuryRawEvent, Task } from './types';

const l = logger('Task: Treasury');

/*
 *  ======= Table (Treasury) ======
 */
const createTreasury: Task<NomidotTreasury[]> = {
  name: 'createTreasury',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotTreasury[]> => {
    const { events } = cached;

    const treasuryEvents = filterEvents(events, 'treasury', 'Deposit');

    const results: NomidotTreasury[] = [];

    treasuryEvents.forEach(event => {
      console.log(event.event.data);
    });

    await Promise.all(
      treasuryEvents.map(async ({ event: { data, typeDef } }) => {
        const treasuryRawEvent: NomidotTreasuryRawEvent = data.reduce(
          (prev, curr, index) => {
            const type = typeDef[index].type;

            return {
              ...prev,
              [type]: curr.toJSON(),
            };
          },
          {}
        );

        const result = {};

        l.log(`Nomidot Treasury: ${JSON.stringify(result)}`);
        results.push(result);
      })
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotTreasury[]) => {
    await prisma.createTreasury({
      blockNumber: {
        connect: {
          number: blockNumber.toNumber(),
        },
      },
    });
  },
};

export default createTreasury;
