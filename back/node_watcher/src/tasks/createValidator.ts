// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import {
  AccountId,
  BlockNumber,
  Hash,
  StakingLedger,
  ValidatorPrefs,
} from '@polkadot/types/interfaces';

import { prisma } from '../../generated/prisma-client';
import { NomidotValidator, Task } from './types';

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

    return Promise.all(
      validators.map(async validator => {
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

        const validatorPreferences: ValidatorPrefs = bonded
          ? await api.query.staking.validators(bonded)
          : await api.query.staking.validators(ledger.stash);

        const stash = bonded.isEmpty ? ledger.stash : validator;
        const controller = ledger.stash || validator;

        return {
          controller,
          stash,
          validatorPreferences,
        };
      })
    );
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
            preferences: validatorPreferences.toHex(),
          });
        })
      );
    }
  },
};

export default createValidator;
