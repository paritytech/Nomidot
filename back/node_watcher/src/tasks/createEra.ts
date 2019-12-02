// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';

import { prisma } from '../../generated/prisma-client';
import { NomidotEra, Task } from './types';

/*
 *  ======= Table (Era) ======
 */
const createEra: Task<NomidotEra> = {
  name: 'createEra',
  read: async (
    blockNumber: BlockNumber,
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotEra> => {
    const idx = await api.query.staking.currentEra.at(blockHash);
    const points = await api.query.staking.currentEraPointsEarned.at(blockHash);
    const currentEraStartSessionIndex = await api.query.staking.currentEraStartSessionIndex.at(
      blockHash
    );

    return {
      idx,
      points,
      startSessionIndex: currentEraStartSessionIndex,
    };
  },
  write: async (value: NomidotEra) => {
    const { idx, points, startSessionIndex } = value;

    // check if record exists
    const eraIndexAlreadyExists = await prisma.$exists.era({
      idx: idx.toString()
    });

    // update or create
    if (eraIndexAlreadyExists) {
      await prisma.updateEra({
        data: {
          individualPoints: {
            set: points.individual.map(points => points.toHex())
          },
          totalPoints: points.total.toHex()
        },
        where: {
          idx: idx.toString()
        }
      })
    } else {
      await prisma.createEra({
        idx: idx.toString(),
        totalPoints: points.total.toHex(),
        individualPoints: {
          set: points.individual.map(points => points.toHex()),
        },
        eraStartSessionIndex: {
          connect: {
            idx: startSessionIndex.toString(),
          },
        },
      });
    }
  },
};

export default createEra;
