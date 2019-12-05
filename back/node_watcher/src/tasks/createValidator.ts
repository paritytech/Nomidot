// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
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
    const validators = await api.query.session.validators.at(blockHash); // validators at this session

    l.log(`Validators: ${JSON.stringify(validators)}`);

    const result = await Promise.all(
      validators.map(async (validator: ValidatorId) => {
        try {
          // bonded controller if validator is a stash
          const bonded: AccountId = await api.query.staking.bonded.at(
            blockHash,
            validator
          );

          // staking ledger information if validator is a controller
          const ledger: StakingLedger = await api.query.staking.ledger.at(
            blockHash,
            validator
          );

          // n.b. In the history of Kusama, there was a point when the Validator set was hard coded in, so during this period, they were actually not properly bonded, i.e. bonded and ledger were actually null.

          const validatorPreferences: ValidatorPrefs = bonded
            ? await api.query.staking.validators.at(blockHash, bonded)
            : await api.query.staking.validators.at(blockHash, ledger.stash);

          const stash = bonded.isEmpty ? ledger.stash : validator;

          const controller = ledger.stash || validator;

          const result = {
            controller,
            stash,
            validatorPreferences,
          };

          return result;
        } catch (e) {
          // l.error(e);

          const result = {
            controller: validator,
            stash: validator,
            validatorPreferences: undefined,
          };

          return result;
        }
      })
    );

    l.log(`Nomidot Validators: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, values: NomidotValidator[]) => {
    if (!values) {
      await prisma.createValidator({
        blockNumber: {
          connect: {
            number: blockNumber.toNumber(),
          },
        },
        controller: '0x00',
        stash: '0x00',
        preferences: '0x00',
      });
    } else {
      await Promise.all(
        values.map(async (validator: NomidotValidator) => {
          const { controller, stash, validatorPreferences } = validator;

          await prisma.createValidator({
            blockNumber: {
              connect: {
                number: blockNumber.toNumber(),
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
    }
  },
};

export default createValidator;
