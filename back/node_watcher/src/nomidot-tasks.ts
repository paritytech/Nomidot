// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, Vec } from '@polkadot/types';
import { ITuple } from '@polkadot/types/types';
import {
  AccountId,
  BlockNumber,
  EventRecord,
  Hash,
  Moment,
  SessionIndex,
  ValidatorPrefs,
  StakingLedger
} from '@polkadot/types/interfaces';

import { prisma } from '../generated/prisma-client';
import {
  Nomidot,
  NomidotBlock,
  NomidotSession,
  NomidotTotalIssuance,
  NomidotValidator,
  NomidotValidators,
  Task,
  NomidotSlashing
} from './types';

/*
*  ======= Table (BlockNumber) ======
*/
const createBlockNumber: Task<NomidotBlock> = {
  read: async (blockNumber: BlockNumber, blockHash: Hash, api: ApiPromise): Promise<NomidotBlock> => {
    const [author, number] = await api.derive.chain.getHeader(blockHash.toHex());

    const startDateTime: Moment = await api.query.timestamp.now.at(blockHash);

    const result: NomidotBlock = {
      authoredBy: createType('AccountId', author),
      blockNumber,
      hash: blockHash,
      startDateTime,
    };

    return result;
  },
  write: async (value: NomidotBlock) => {
    const { authoredBy, blockNumber, hash, startDateTime } = value;

    const blockNumberCreateInput = {
      authoredBy: authoredBy.toHex(),
      number: blockNumber.toNumber(),
      hash: hash.toHex(),
      startDateTime: new Date(startDateTime.toNumber() * 1000).toISOString(),
    };

    console.log(`block number create input: ${blockNumberCreateInput}`);

    await prisma.createBlockNumber(blockNumberCreateInput);
  },
};

/*
*  ======= Table (TotalIssuance) ======
*/
const createTotalIssuance: Task<NomidotTotalIssuance> = {
  read: async (blockNumber: BlockNumber, blockHash: Hash, api: ApiPromise): Promise<NomidotTotalIssuance> => {
    const amount = await api.query.balances.totalIssuance.at(blockHash);

    return {
      blockNumber,
      amount
    }
  },
  write: async (value: NomidotTotalIssuance) => {
    const totalIssuanceCreateInput = {
      amount: value.amount.toNumber(),
      blockNumber: {
        connect: {
          number: value.blockNumber.toNumber()
        }
      }
    }
    
    await prisma.createTotalIssuance(totalIssuanceCreateInput);
  }
}

/*
*  ======= Table (Validator) ======
*/
const createValidator: Task<NomidotValidators> = {
  read: async (blockNumber: BlockNumber, blockHash: Hash, api: ApiPromise): Promise<NomidotValidators> => {
    const validators = await api.query.session.validators.at(blockHash); // validators at this session
    
    let result: NomidotValidators = []
    validators.forEach(async (validator) => {
      // bonded controller if validator is a stash
      const bonded: AccountId = await api.query.staking.bonded.at(blockHash, validator);
      // staking ledger information if validator is a controller
      const ledger: StakingLedger = await api.query.staking.ledger.at(blockHash, validator);

      const validatorPreferences: ValidatorPrefs = bonded ? await api.query.staking.validators(bonded) : await api.query.staking.validators(ledger.stash);

      const stash = bonded.isEmpty ? ledger.stash : validator;
      const controller = ledger.stash || validator;

      result.push({
        blockNumber,
        controller,
        stash,
        validatorPreferences
      });
    });

    return result;
  },
  write: async(values: NomidotValidators) => {
    values.forEach(async (validator: NomidotValidator) => {
      const { blockNumber, controller, stash, validatorPreferences } = validator;
      
      await prisma.createValidator({
        blockNumber: {
          connect: {
            number: blockNumber.toNumber()
          }
        },
        controller: controller.toHex(),
        stash: stash.toHex(),
        preferences: validatorPreferences.toHex()
      })
    });
  }
}

/*
*  ======= Table (Session) ======
*/
const createSession: Task<NomidotSession> = {
  read: async (blockNumber: BlockNumber, blockHash: Hash, api: ApiPromise): Promise<NomidotSession> => {
    // FIXME?: as of now there is no way to .at() on a derive query so just do it yourself.

    const sessionIndex = await api.query.staking.currentEraStartSessionIndex.at(blockHash);
    const sessionLength = api.consts.babe.epochDuration;
    const sessionsPerEra = api.consts.staking.sessionsPerEra;

    return {
      id: sessionIndex
    }

  },
  write: async (value: NomidotSession) => {
    const sessionCreateInput = {
      id: value.sessionIndex.toNumber(),

    }

    await prisma.createSession(sessionCreateInput);
  }
}

/*
*  ======= Table (Slashing) ======
*/
const createSlashing: Task<NomidotSlashing> = {
  read: async (blockNumber: BlockNumber, blockHash: Hash, api: ApiPromise): Promise<NomidotSlashing> => {
    const eventsAtBlock: Vec<EventRecord> = await api.query.system.events.at(blockHash);

    // parse events for topic == Slashing

    // get reason and amount
  },
  write: async (value: NomidotSlashing) => {

  }
}


const nomidotTasks: Task<Nomidot>[] = [
  createBlockNumber,
  createSession,
  createSlashing,
  createTotalIssuance,
  createValidator
];

export default nomidotTasks;


// const createImOnline: Task<any> = {
//   read: async (blockNumber: number, api: ApiPromise): Promise<NomidotHeartBeat> => {
//     const hash: Hash = await api.query.system.blockHash(blockNumber);

//     const currentEpochAuthorities: Vec<ITuple<[AccountId, BabeAuthorityWeight]>> = await api.query.babe.authorities();

//     const justAuthorityIds = currentEpochAuthorities.map(item => item[0]);

//     const derivedHeartBeats: DerivedHeartbeats = await api.derive.imOnline.receivedHeartbeats(justAuthorityIds);

//     const result: NomidotHeartBeat = {
//       blockNumber,

//     }

//     return result;

//   },
//   write: async (value: NomidotHeartBeat) => {
//     await prisma.createHeartBeat({
//       blockNumber: createBlockNumber.write(),
//       isOnline: value.isOnline,
//       sender: value.sender.toHex()
//     })
//   }
// }