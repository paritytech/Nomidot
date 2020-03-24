// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import {
  AccountId,
  BlockNumber,
  EraIndex,
  Exposure,
  Hash,
  StakingLedger,
  ValidatorId,
  ValidatorPrefs,
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { filterEvents } from '../util/filterEvents';
import { Cached, NomidotNominationAndValidators, Task } from './types';

const l = logger('Task: Nomination + Validators');

/*
 *  ======= Table (Nomination and Validators) ======
 */
const createNominationAndValidators: Task<Set<
  NomidotNominationAndValidators
>> = {
  name: 'createNominationAndValidators',
  read: async (
    blockHash: Hash,
    cached: Cached,
    api: ApiPromise
  ): Promise<Set<NomidotNominationAndValidators>> => {
    const result: Set<NomidotNominationAndValidators> = new Set();
    const { events, sessionIndex } = cached;

    const didNewSessionStart =
      filterEvents(events, 'session', 'NewSession').length > 0;

    if (didNewSessionStart) {
      // validators at this session
      const validators = await api.query.session.validators.at(blockHash);
      await Promise.all(
        validators.map(async (validator: ValidatorId) => {
          // bonded controller if validator is a stash
          const bonded: Option<AccountId> = await api.query.staking.bonded.at(
            blockHash,
            validator
          );

          // staking ledger information if validator is a controller
          const ledger: Option<StakingLedger> = await api.query.staking.ledger.at(
            blockHash,
            validator
          );

          // n.b. In the history of Kusama, there was a point when the Validator set was hard coded in, so during this period, they were actually not properly bonded, i.e. bonded and ledger were actually null.
          if (bonded.isNone && ledger.isNone) {
            const result = {
              stakedAmount: null,
              session: sessionIndex,
              nominatorController: null,
              nominatorStash: null,
              validatorPreferences: null,
              validatorController: validator,
              validatorStash: validator,
            };

            return result;
          }

          const validatorStash = bonded.isNone
            ? ledger.unwrap().stash
            : validator;

          const validatorController =
            ledger.isSome && ledger.unwrap().stash
              ? validator
              : bonded.unwrap();

          const validatorPreferences: ValidatorPrefs = await api.query.staking.validators.at(
            blockHash,
            validatorStash
          );

          let exposure: Exposure;

          if (api.query.staking.stakers) {
            exposure = await api.query.staking.stakers.at<Exposure>(blockHash);
          } else {
            const currentEra: Option<EraIndex> = await api.query.staking.currentEra.at(
              blockHash
            );

            exposure = await api.query.staking.erasStakers.at<Exposure>(
              blockHash,
              currentEra.unwrap(),
              validatorStash
            );
          }
          // per validator in session, get nominator info
          await Promise.all(
            exposure.others.map(async individualExposure => {
              const { who, value } = individualExposure;

              // bonded controller if nominator is a stash
              const bonded: Option<AccountId> = await api.query.staking.bonded.at(
                blockHash,
                who
              );

              // staking ledger information if nominator is a controller
              const ledger: Option<StakingLedger> = await api.query.staking.ledger.at(
                blockHash,
                who
              );

              const nominatorStash = bonded.isNone
                ? ledger.unwrapOr({ stash: null }).stash
                : who;

              const nominatorController =
                ledger.isSome && ledger.unwrapOr({ stash: null }).stash
                  ? who
                  : bonded.unwrapOr(null);

              result.add({
                nominatorStash,
                nominatorController,
                session: sessionIndex,
                stakedAmount: value,
                validatorController,
                validatorStash,
                validatorPreferences,
              } as NomidotNominationAndValidators);
            })
          );
        })
      );
    } else {
      l.log('Session did not change. Skipping....');
    }

    return result;
  },
  write: async (
    blockNumber: BlockNumber,
    values: Set<NomidotNominationAndValidators>
  ) => {
    for await (const nominationsAndValidators of values) {
      const {
        stakedAmount,
        session,
        nominatorController,
        nominatorStash,
        validatorController,
        validatorStash,
        validatorPreferences,
      } = nominationsAndValidators;

      await prisma.createValidator({
        session: {
          connect: {
            index: session.toNumber(),
          },
        },
        controller: validatorController ? validatorController.toHex() : '0x00',
        stash: validatorStash ? validatorStash.toHex() : '0x00',
        preferences: validatorPreferences
          ? validatorPreferences.toHex()
          : '0x00',
      });

      await prisma.createNomination({
        session: {
          connect: {
            index: session.toNumber(),
          },
        },
        validatorController: validatorController
          ? validatorController.toHex()
          : '0x00',
        validatorStash: validatorStash ? validatorStash.toHex() : '0x00',
        nominatorController: nominatorController
          ? nominatorController.toHex()
          : '0x00',
        nominatorStash: nominatorStash ? nominatorStash.toHex() : '0x00',
        stakedAmount: stakedAmount.toHex(),
      });
    }
  },
};

export default createNominationAndValidators;
