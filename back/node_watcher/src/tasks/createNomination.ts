// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Option } from '@polkadot/types';
import {
  AccountId,
  BlockNumber,
  Exposure,
  Hash,
  StakingLedger,
  ValidatorId,
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { NomidotNomination, Task } from './types';

const l = logger('Task: Nomination');

/*
 *  ======= Table (Nomination) ======
 */
const createNomination: Task<NomidotNomination[]> = {
  name: 'createNomination',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotNomination[]> => {
    const currentSessionIndex = await api.query.session.currentIndex.at(
      blockHash
    );
    
    const validators = await api.query.session.validators.at(blockHash); // validators at this session

    // l.log(`Validators: ${JSON.stringify(validators)}`);

    const nomidotNomination: NomidotNomination[] = [];

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
            currentSessionIndex,
            validatorController: validator,
            validatorStash: validator,
            nominatorController: null,
            nominatorStash: null,
            stakedAmount: null
          };

          return result;
        }

        const validatorStash = bonded.isNone ? ledger.unwrap().stash : validator;

        const validatorController =
          ledger.isSome && ledger.unwrap().stash ? validator : bonded.unwrap();

        
        const exposure: Exposure = await api.query.staking.stakers.at(blockHash, validatorStash);

        await Promise.all(exposure.others.map(async individualExposure => {
          const { who, value } = individualExposure;

          // bonded controller if validator is a stash
          const bonded: Option<AccountId> = await api.query.staking.bonded.at(
            blockHash,
            who
          );

          // staking ledger information if validator is a controller
          const ledger: Option<StakingLedger> = await api.query.staking.ledger.at(
            blockHash,
            who
          );

          const nominatorStash = bonded.isNone ? ledger.unwrap().stash : validator;

          const nominatorController =
            ledger.isSome && ledger.unwrap().stash ? validator : bonded.unwrap();

          nomidotNomination.push({
            session: currentSessionIndex,
            validatorController,
            validatorStash,
            nominatorStash,
            nominatorController,
            stakedAmount: value
          } as NomidotNomination)
        }))
      })
    );

    l.log(`Nomidot Nomination: ${JSON.stringify(nomidotNomination)}`);

    return nomidotNomination;
  },
  write: async (blockNumber: BlockNumber, values: NomidotNomination[]) => {
    await Promise.all(
      values.map(async (nomination: NomidotNomination) => {
        const {
          session,
          validatorController,
          validatorStash,
          nominatorController,
          nominatorStash,
          stakedAmount
        } = nomination;

        await prisma.createNomination({
          session: {
            connect: {
              index: session.toNumber(),
            },
          },
          validatorController: validatorController.toHex(),
          validatorStash: validatorStash.toHex(),
          nominatorController: nominatorController.toHex(),
          nominatorStash: nominatorStash.toHex(),
          stakedAmount: stakedAmount.toHex()
        });
      })
    );
  },
};

export default createNomination;
