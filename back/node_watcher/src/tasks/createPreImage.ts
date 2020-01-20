// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

// import { prisma } from '../generated/prisma-client';
import { NomidotPreImage, Task } from './types';

const l = logger('Task: PreImage');

/*
 *  ======= Table (PreImage) ======
 */
const createPreImage: Task<NomidotPreImage[]> = {
  name: 'createPreImage',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotPreImage[]> => {
    const events = await api.query.system.events.at(blockHash);

    const preImageEvents = events.filter(
      ({ event: { method, section } }) =>
        section === 'democracy' && method === 'PreimageNoted'
    );

    preImageEvents.forEach(({ event }) => {
      const types = event.typeDef;
      let propIndex = null;

      const PreImageArguments = event.data.map((data, index) => {
        const type = types[index].type;

        if (type === 'PropIndex') {
          propIndex = Number(data);
        }

        return {
          type,
          data: data.toString(),
        };
      });
      console.log(`methos: ${event.method}, section: ${event.section}`);
      console.log(`PreImageArguments: ${JSON.stringify(PreImageArguments)}`);
    });

    // const preImageRaw = await api.query.democracy.preimages(preImageHash);
    // const preImage = preImageRaw.unwrapOr(null);

    // if (!preImage) {
    //   l.log(`No pre-image found for the proposal id #${proposalId}`);
    //   return null;
    // }

    // const depositInfo = depositOf.unwrapOr(null);
    // const depositAmount = depositInfo ? depositInfo[0] : undefined;

    // if (!depositAmount) {
    //   l.log(`No deposit amount found for the proposal id #${proposalId}`);
    //   return null;
    // }

    // const proposal = createType(
    //   api.registry,
    //   'Proposal',
    //   preImage[0].toU8a(true)
    // );

    // const PreImageIndex = await api.query.PreImage.currentIndex.at(blockHash);

    const result = {
      value: 'bla',
    };

    l.log(`Nomidot PreImage: ${JSON.stringify(result)}`);

    return [];
  },
  write: async (blockNumber: BlockNumber, value: NomidotPreImage[]) => {
    // const { didNewPreImageStart, idx } = value;
    // if (didNewPreImageStart) {
    //   await prisma.createPreImage({
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

export default createPreImage;
