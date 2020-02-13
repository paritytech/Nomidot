// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, Vec } from '@polkadot/types';
import { BlockNumber, EventRecord, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { NomidotSlashing, Task } from './types';
import { filterEvents } from 'src/util/filterEvents';

const l = logger('Task: Slashing');

/*
 *  ======= Table (Slashing) ======
 */
const createSlashing: Task<NomidotSlashing[]> = {
  name: 'createSlashing',
  read: async (
    blockHash: Hash,
    events: EventRecord[],
    api: ApiPromise
  ): Promise<NomidotSlashing[]> => {
    const slashEvents = filterEvents(events, 'staking', 'Slash');

    const result: NomidotSlashing[] = [];

    slashEvents.map(({ event: { data } }) => {
      result.push({
        who: createType(api.registry, 'AccountId', data[0].toString()),
        amount: createType(api.registry, 'Balance', data[1].toString()),
      });
    });

    l.log(`Nomidot Slashing: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotSlashing[]) => {
    await Promise.all(
      value.map(async slashEvent => {
        const { who, amount } = slashEvent;
        await prisma.createSlashing({
          blockNumber: {
            connect: {
              number: blockNumber.toNumber(),
            },
          },
          who: who.toHex(),
          amount: amount.toHex(),
        });
      })
    );
  },
};

export default createSlashing;
