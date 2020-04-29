// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import {
  BlockNumber,
  Hash,
  EventRecord,
  TreasuryProposal,
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { treasuryProposalStatus } from '../util/statuses';
import {
  Cached,
  NomidotTreasury,
  NomidotTreasuryRawEvent,
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

    let treasuryEvents: EventRecord[] | null = filterEvents(
      events,
      'treasury',
      treasuryProposalStatus.PROPOSED
    );

    const results: NomidotTreasury[] = [];

    await Promise.all(
      treasuryEvents.map(async ({ event: { data, typeDef } }) => {
        let treasuryRawEvent: NomidotTreasuryRawEvent | null = data.reduce(
          (prev, curr, index) => {
            const type = typeDef[index].type;

            return {
              ...prev,
              [type]: curr.toJSON(),
            };
          },
          {}
        );

        if (
          !treasuryRawEvent.ProposalIndex &&
          treasuryRawEvent.ProposalIndex !== 0
        ) {
          l.error(
            `Expected ProposalIndex missing in the event: ${treasuryRawEvent.ProposalIndex}`
          );
          return null;
        }

        let treasuryProposalRaw: Option<TreasuryProposal> | null = await api.query.treasury.proposals.at(
          blockHash,
          treasuryRawEvent.ProposalIndex
        );

        if (treasuryProposalRaw!.isNone) {
          l.error('Expected data missing in treasuryProposalRaw');
          return null;
        }

        let treasuryProposal: TreasuryProposal | null = treasuryProposalRaw!.unwrap();
        let result: NomidotTreasury | null = {
          treasuryProposalId: treasuryRawEvent.ProposalIndex,
          proposer: treasuryProposal.proposer,
          beneficiary: treasuryProposal.beneficiary,
          value: treasuryProposal.value,
          bond: treasuryProposal.bond,
          status: treasuryProposalStatus.PROPOSED,
        };

        l.log(`Nomidot Treasury: ${JSON.stringify(result)}`);

        results.push(result);

        // explicitly clean references
        treasuryProposal = null;
        treasuryProposalRaw = null;
        treasuryRawEvent = null;
        result = null;
      })
    );

    // explicitly clean references
    treasuryEvents = null;
    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotTreasury[]) => {
    await Promise.all(
      value.map(async prop => {
        const {
          proposer,
          beneficiary,
          value,
          bond,
          treasuryProposalId,
          status,
        } = prop;

        await prisma.createTreasurySpendProposal({
          proposer: proposer.toString(),
          treasuryProposalId,
          beneficiary: beneficiary.toString(),
          value: value.toString(),
          bond: bond.toString(),
          treasuryStatus: {
            create: {
              blockNumber: {
                connect: {
                  number: blockNumber.toNumber(),
                },
              },
              status,
              uniqueStatus: `${treasuryProposalId}_${status}`,
            },
          },
        });
      })
    );
  },
};

export default createTreasury;
