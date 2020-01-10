// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import {
  AccountId,
  BlockNumber,
  Hash,
  StakingLedger,
  ValidatorId,
  ValidatorPrefs,
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { NomidotValidator, Task } from './types';

const l = logger('Task: Validator');

/*
 *  ======= Table (Validator) ======
 */
const createValidator: Task<NomidotValidator[]> = {
  name: 'createValidator',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotValidator[]> => {
    const currentSessionIndex = await api.query.session.currentIndex.at(
      blockHash
    );
    const validators = await api.query.session.validators.at(blockHash); // validators at this session

    // l.log(`Validators: ${JSON.stringify(validators)}`);

    const result = await Promise.all(
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

        l.warn(`Bonded: ${bonded}`);
        l.warn(`Ledger: ${ledger}`);

        // n.b. In the history of Kusama, there was a point when the Validator set was hard coded in, so during this period, they were actually not properly bonded, i.e. bonded and ledger were actually null.
        if (bonded.isNone && ledger.isNone) {
          const result = {
            currentSessionIndex,
            controller: validator,
            stash: validator,
            validatorPreferences: undefined,
          };

          return result;
        }

        const stash = bonded.isNone ? ledger.unwrap().stash : validator;

        const controller =
          ledger.isSome && ledger.unwrap().stash ? validator : bonded.unwrap();

        const validatorPreferences: ValidatorPrefs = await api.query.staking.validators.at(
          blockHash,
          stash
        );

        const result = {
          currentSessionIndex,
          controller,
          stash,
          validatorPreferences,
        };

        return result;
      })
    );

    l.log(`Nomidot Validators: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, values: NomidotValidator[]) => {
    await Promise.all(
      values.map(async (validator: NomidotValidator) => {
        const {
          currentSessionIndex,
          controller,
          stash,
          validatorPreferences,
        } = validator;

        await prisma.createValidator({
          session: {
            connect: {
              index: currentSessionIndex.toNumber(),
            },
          },
          controller: controller.toHex(),
          stash: stash.toHex(),
          preferences: validatorPreferences
            ? validatorPreferences.toHex()
            : '0x00',
        });
      })
    );
  },
};

export default createValidator;
