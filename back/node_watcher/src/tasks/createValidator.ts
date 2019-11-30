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
  read: async (
    blockNumber: BlockNumber,
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotValidator[]> => {
    const validators = await api.query.session.validators.at(blockHash); // validators at this session

    const result: NomidotValidator[] = [];
    validators.forEach(async validator => {
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

      result.push({
        blockNumber,
        controller,
        stash,
        validatorPreferences,
      });
    });

    return result;
  },
  write: async (values: NomidotValidator[]) => {
    values.forEach(async (validator: NomidotValidator) => {
      const {
        blockNumber,
        controller,
        stash,
        validatorPreferences,
      } = validator;

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
    });
  },
};

export default createValidator;
