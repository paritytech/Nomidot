// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { BlockNumber, EventRecord, FullIdentification, Hash, IdentificationTuple, ValidatorId } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { SomeOfflineEvent, Task, NomidotOfflineValidator } from './types';
import { filterEvents } from '../util/filterEvents';

const l = logger('Task: OfflineValidator');

/*
 *  ======= Table (OfflineValidator) ======
 */
const createOfflineValidator: Task<NomidotOfflineValidator[]> = {
  name: 'createOfflineValidator',
  read: async (blockHash: Hash, api: ApiPromise): Promise<NomidotOfflineValidator[]> => {
    const events = await api.query.system.events.at(blockHash);

    // At the end of the session, these validators were found to be offline.
    const someOfflineEvents: EventRecord[] = filterEvents(events, 'imOnline', 'SomeOffline')

    // At the end of the session, no offence was committed.
    const allGoodEvents: EventRecord[] = filterEvents(events, 'imOnline', 'AllGood');

    let result: NomidotOfflineValidator[] = [];

    if (someOfflineEvents && someOfflineEvents.length) {
      const sessionIndex = await api.query.session.currentIndex.at(blockHash);

      someOfflineEvents.map(({ event: { data } }) => {
        data.map((idTuples) => {
          // @ts-ignore
          idTuples.map(idTuple => {
            const validatorId: ValidatorId = idTuple[0];
            const fullId: FullIdentification = idTuple[1];
            const { total, own, others } = fullId;

            result.push({
              sessionIndex,
              wasThereAnOffenceThisSession: !!allGoodEvents.length,
              validatorId,
              total,
              own,
              others
            } as NomidotOfflineValidator)
          })
        })
      })
    }

    l.log(`Offline Validators : ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, offlineValidators: NomidotOfflineValidator[]) => {
    await Promise.all(
      offlineValidators.map(async (offlineValidator: NomidotOfflineValidator) => {
      const { sessionIndex, wasThereAnOffenceThisSession, validatorId, total, own, others } = offlineValidator;

      await prisma.createOfflineValidator({
        sessionIndex: {
          connect: {
            index: sessionIndex.toNumber()
          }
        },
        wasThereAnOffenceThisSession,
        validatorId: validatorId.toString(),
        total: total.toHex(),
        own: own.toHex(),
        others
      })
    })
  )}
};

export default createOfflineValidator;