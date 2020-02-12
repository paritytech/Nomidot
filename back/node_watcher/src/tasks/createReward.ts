// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, EventRecord, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { NomidotReward, Task } from './types';

const l = logger('Task: Reward');

/*
 *  ======= Table (Reward) ======
 */
const createReward: Task<NomidotReward[]> = {
  name: 'createReward',
  read: async (blockHash: Hash, api: ApiPromise): Promise<NomidotReward[]> => {
    const events = await api.query.system.events.at(blockHash);

    const rewardEvents: EventRecord[] = filterEvents(
      events,
      'staking',
      'Reward'
    );

    const result: NomidotReward[] = [];

    if (rewardEvents) {
      const sessionIndex = await api.query.session.currentIndex.at(blockHash);

      rewardEvents.map(({ event: { data } }) => {
        const treasuryReward = api.createType('Balance', data[1]);
        const validatorReward = api.createType('Balance', data[0]);

        result.push({
          authoredBlock: blockHash,
          sessionIndex,
          treasuryReward,
          validatorReward,
        } as NomidotReward);
      });
    }

    l.log(`Reward: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, rewards: NomidotReward[]) => {
    await Promise.all(
      rewards.map(
        async ({
          authoredBlock,
          sessionIndex,
          treasuryReward,
          validatorReward,
        }) => {
          await prisma.createReward({
            authoredBlock: {
              connect: {
                hash: authoredBlock.toHex(),
              },
            },
            sessionIndex: {
              connect: {
                index: sessionIndex.toNumber(),
              },
            },
            treasuryReward: treasuryReward.toHex(),
            validatorReward: validatorReward.toHex(),
          });
        }
      )
    );
  },
};

export default createReward;
