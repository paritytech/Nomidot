// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, Vec } from '@polkadot/types';
import { BlockNumber, EventRecord, Hash } from '@polkadot/types/interfaces';

import { prisma } from '../../generated/prisma-client';
import { NomidotSlashing, Task } from './types';

/*
 *  ======= Table (Slashing) ======
 */
const createSlashing: Task<NomidotSlashing[]> = {
  name: 'createSlashing',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotSlashing[]> => {
    const eventsAtBlock: Vec<EventRecord> = await api.query.system.events.at(
      blockHash
    );

    const slashEvents = eventsAtBlock.filter(
      ({ event: { section, method } }) => {
        section === 'staking' && method === 'slash';
      }
    );
    
    let result: NomidotSlashing[] = [];
      
    slashEvents.map(({ event: { data } }) => {
      result.push({
        who: createType(api.registry, 'AccountId', data[0].toString()),
        amount: createType(api.registry, 'Balance', data[1].toString()),
      });
    });

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotSlashing[]) => {
    // there were no slashings
    if (!value.length) {
      await prisma.createSlashing({
        blockNumber: {
          connect: {
            number: blockNumber.toString()
          }
        },
        reason: '0x00',
        amount: '0x00'
      })
    }

    value.forEach(async slashEvent => {
      const { who, amount } = slashEvent;
      await prisma.createSlashing({
        blockNumber: {
          connect: {
            number: blockNumber.toString(),
          },
        },
        reason: who.toHex(),
        amount: amount.toHex(),
      });
    });
  },
};

export default createSlashing;
