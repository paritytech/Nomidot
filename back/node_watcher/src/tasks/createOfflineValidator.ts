// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import {
  BlockNumber,
  EventRecord,
  FullIdentification,
  Hash,
  IdentificationTuple,
  ValidatorId,
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { Cached, NomidotOfflineValidator, Task } from './types';

const l = logger('Task: OfflineValidator');

/*
 *  ======= Table (OfflineValidator) ======
 */
const createOfflineValidator: Task<NomidotOfflineValidator[]> = {
  name: 'createOfflineValidator',
  read: (
    _blockHash: Hash,
    cached: Cached,
    _api: ApiPromise
  ): Promise<NomidotOfflineValidator[]> => {
    const { events, sessionIndex } = cached;
    // At the end of the session, these validators were found to be offline.
    const someOfflineEvents: EventRecord[] = filterEvents(
      events,
      'imOnline',
      'SomeOffline'
    );

    const result: NomidotOfflineValidator[] = [];

    if (someOfflineEvents && someOfflineEvents.length) {
      someOfflineEvents.map(({ event: { data } }: EventRecord) => {
        data.map(idTuples => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          idTuples.map((idTuple: IdentificationTuple) => {
            const validatorId: ValidatorId = idTuple[0];
            const fullId: FullIdentification = idTuple[1];
            const { total, own, others } = fullId;

            result.push({
              sessionIndex,
              validatorId,
              total,
              own,
              others,
            } as NomidotOfflineValidator);
          });
        });
      });
    }

    l.log(`Offline Validators : ${JSON.stringify(result)}`);

    return Promise.resolve(result);
  },
  write: async (
    blockNumber: BlockNumber,
    offlineValidators: NomidotOfflineValidator[]
  ) => {
    await Promise.all(
      offlineValidators.map(
        async (offlineValidator: NomidotOfflineValidator) => {
          const {
            sessionIndex,
            validatorId,
            total,
            own,
            others,
          } = offlineValidator;

          await prisma.createOfflineValidator({
            sessionIndex: {
              connect: {
                index: sessionIndex.toNumber(),
              },
            },
            validatorId: validatorId.toString(),
            total: total.toHex(),
            own: own.toHex(),
            others: {
              set: others.map(other => {
                return {
                  who: other.who.toHex(),
                  value: other.value.toHex(),
                };
              }),
            },
          });
        }
      )
    );
  },
};

export default createOfflineValidator;
