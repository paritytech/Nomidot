// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, TypeRegistry, Vec } from '@polkadot/types';
import { BlockNumber, EventRecord, Hash } from '@polkadot/types/interfaces';

import { prisma } from '../../generated/prisma-client';
import { NomidotSlashing, Task } from './types';

/*
 *  ======= Table (Slashing) ======
 */
const createSlashing: Task<NomidotSlashing[]> = {
  read: async (
    blockNumber: BlockNumber,
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

    const result: NomidotSlashing[] = [];

    slashEvents.map(({ event: { data } }) => {
      result.push({
        blockNumber,
        who: createType('AccountId', data[0].toString()),
        amount: createType('Balance', data[1].toString()),
      });
    });

    return result;
  },
  write: async (value: NomidotSlashing[]) => {
    value.forEach(async slashEvent => {
      const { blockNumber, who, amount } = slashEvent;

      await prisma.createSlashing({
        blockNumber: {
          connect: {
            number: blockNumber.toNumber(),
          },
        },
        reason: who.toHex(),
        amount: amount.toNumber(),
      });
    });
  },
};

export default createSlashing;
