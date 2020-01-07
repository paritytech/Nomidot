// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, Vec } from '@polkadot/types';
import { BlockNumber, EventRecord, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

// import { prisma } from '../generated/prisma-client';
import { NomidotSlashing, Task } from './types';

const l = logger('Task: Proposals');

/*
 *  ======= Table (Slashing) ======
 */
const createProposal: Task<NomidotSlashing[]> = {
  name: 'createProposal',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotSlashing[]> => {
    const eventsAtBlock: Vec<EventRecord> = await api.query.system.events.at(
      blockHash
    );

    const proposalEvents = eventsAtBlock.filter(
      ({ event: { section, method } }) =>
        section === 'democracy' && method === 'propose'
    );

    console.log('proposalEvents', proposalEvents);
    const result: NomidotSlashing[] = [];

    // slashEvents.map(({ event: { data } }) => {
    //   result.push({
    //     who: createType(api.registry, 'AccountId', data[0].toString()),
    //     amount: createType(api.registry, 'Balance', data[1].toString()),
    //   });
    // });

    l.log(`Nomidot Proposals: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotSlashing[]) => {
    //   await Promise.all(
    //     value.map(async slashEvent => {
    //       const { who, amount } = slashEvent;
    //       await prisma.createSlashing({
    //         blockNumber: {
    //           connect: {
    //             number: blockNumber.toNumber(),
    //           },
    //         },
    //         who: who.toHex(),
    //         amount: amount.toHex(),
    //       });
    //     })
    //   );
  },
};

export default createProposal;
