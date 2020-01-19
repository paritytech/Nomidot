// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

// import { prisma } from '../generated/prisma-client';
import { NomidotProposalStatus, Task } from './types';

const l = logger('Task: ProposalStatus');

/*
 *  ======= Table (ProposalStatus) ======
 */
const createProposalStatus: Task<NomidotProposalStatus> = {
  name: 'createProposalStatus',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotProposalStatus> => {
    const events = await api.query.system.events.at(blockHash);

    const democracyEvents = events.filter(
      ({ event: { section } }) => section === 'democracy'
    );
    console.log('democracyEvents', democracyEvents);
    //  && method === 'NewProposalStatus'

    // const sessionIndex = await api.query.session.currentIndex.at(blockHash);

    const result = {
      status: 'bal',
    };

    l.log(`Nomidot ProposalStatus: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotProposalStatus) => {
    // const { didNewProposalStatusStart, idx } = value;
    // if (didNewProposalStatusStart) {
    //   await prisma.createProposalStatus({
    //     index: idx.toNumber(),
    //     start: {
    //       connect: {
    //         number: blockNumber.toNumber(),
    //       },
    //     },
    //   });
    // }
  },
};

export default createProposalStatus;
