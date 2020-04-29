// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, EventRecord, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma, Council as PrismaCouncil } from '../generated/prisma-client';
import { Cached, NomidotCouncil, Task } from './types';

const l = logger('Task: Councils');

/*
 *  ======= Table (Council) ======
 */
const createCouncil: Task<NomidotCouncil> = {
  name: 'createCouncil',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<NomidotCouncil> => {
    let { events } = cached;

    let electionEvents: EventRecord[] | null = events.filter(
      ({ event: { method, section } }) =>
        section === 'electionsPhragmen' &&
        ['MemberKicked', 'MemberRenounced', 'NewTerm'].includes(method)
    );

    let result: NomidotCouncil = [];

    if (!electionEvents.length) {
      return result;
    }

    result = await api.query.council.members.at(blockHash);

    l.log(`Nomidot Council: ${JSON.stringify(result)}`);
    
    // explicitly dereference
    electionEvents = null;

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotCouncil) => {
    if (value.length) {
      let newCouncil: PrismaCouncil | null = await prisma.createCouncil({
        blockNumber: {
          connect: {
            number: blockNumber.toNumber(),
          },
        },
      });

      value.map(async _address => {
        await prisma.upsertCouncilMember({
          create: {
            address: _address.toString(),
            councils: {
              connect: { id: newCouncil!.id },
            },
          },
          update: {
            councils: {
              connect: { id: newCouncil!.id },
            },
          },
          where: {
            address: _address.toString(),
          },
        });
      });
      
      // explicitly dereference
      newCouncil = null;
    }
  },
};

export default createCouncil;
