// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import { BlockNumber, EraRewardPoints, EraPoints, Hash, SessionIndex } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma, Session } from '../generated/prisma-client';
import { Cached, NomidotEra, Task } from './types';

const l = logger('Task: Era');

/*
 *  ======= Table (Era) ======
 */
const createEra: Task<NomidotEra> = {
  name: 'createEra',
  read: async (
    blockHash: Hash,
    _cached: Cached,
    api: ApiPromise
  ): Promise<NomidotEra> => {
    const idx = await api.query.staking.currentEra.at(blockHash);
    let points;
    let currentEraStartSessionIndex;
    let result = {} as NomidotEra;

    if(api.query.staking.currentEraStartSessionIndex) {
      points = await api.query.staking.currentEraPointsEarned.at<EraPoints>(blockHash);	
      currentEraStartSessionIndex = await api.query.staking.currentEraStartSessionIndex.at<SessionIndex>(blockHash)
    } else {
      points = await api.query.staking.erasRewardPoints.at<EraRewardPoints>(blockHash, idx.unwrap());
      currentEraStartSessionIndex = await api.query.staking.erasStartSessionIndex.at<Option<SessionIndex>>(
        blockHash,
        idx.unwrap()
      );

      result = {
        idx,
        points,
        startSessionIndex: currentEraStartSessionIndex.unwrap(),
      };
    }

    l.log(`NomidotEra: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotEra) => {
    if (value.idx.isNone) {
      return;
    }

    const { idx, points, startSessionIndex } = value;

    // check if record exists
    const eraIndexAlreadyExists = await prisma.$exists.era({
      index: idx.unwrap().toNumber(),
    });

    if (eraIndexAlreadyExists) {
      await prisma.updateEra({
        data: {
          individualPoints: {
            set: points.individual.toHex(),
          },
          totalPoints: points.total.toHex(),
        },
        where: {
          index: idx.unwrap().toNumber(),
        },
      });
    } else if (startSessionIndex.toNumber() > 0) {
      // only start writing after there's actually been a session.
      await prisma.createEra({
        index: idx.unwrap().toNumber(),
        totalPoints: points.total.toHex(),
        individualPoints: {
          set: points.individual.toHex(),
        },
        eraStartSessionIndex: {
          connect: {
            index: startSessionIndex.toNumber(),
          },
        },
      });
    }
  },
};

export default createEra;
