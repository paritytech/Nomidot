// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import {
  Cached,
  NomidotTreasury,
  Task,
} from './types';

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

    const treasuryEvents = filterEvents(events, 'treasury', 'PROPOSED');

    const results: NomidotTreasury[] = [];

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotTreasury[]) => {
    await Promise.all(
      value.map(async prop => {
        const {
            status
        } = prop;


        // await prisma.createTreasury({
        //     status
        // });
      })
    );
  },
};

export default createTreasury;
