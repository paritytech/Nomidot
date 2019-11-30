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
  NomidotEra,
  NomidotSession,
  NomidotTotalIssuance,
  NomidotValidator,
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
const createValidator: Task<NomidotValidator[]> = {
  read: async (blockNumber: BlockNumber, blockHash: Hash, api: ApiPromise): Promise<NomidotValidator[]> => {
    const validators = await api.query.session.validators.at(blockHash); // validators at this session
    
    let result: NomidotValidator[] = []
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
  write: async(values: NomidotValidator[]) => {
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
* ====== Table(ImOnline) =========
*/

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

/*
*  ======= Table (Session) ======
*/
const createSession: Task<NomidotSession> = {
  read: async (blockNumber: BlockNumber, blockHash: Hash, api: ApiPromise): Promise<NomidotSession> => {
    // check events for if a new session has happened.
    // Question: is there a better way to do this?
    const events = await api.query.system.events.at(blockHash);
    
    const didNewSessionStart = events.filter(({ event: { method, section } }): boolean => (
      section === 'system' && method === 'newSession'
    )).length > 0;

    const sessionIndex = await api.query.session.currentIndex.at(blockHash);

    return {
      didNewSessionStart,
      idx: sessionIndex,
      blockNumber
    }
  },
  write: async (value: NomidotSession) => {
    const { blockNumber, didNewSessionStart, idx } = value;

    if (didNewSessionStart) {
      await prisma.updateSession({
        data: {
          end: {
            connect: {
              number: blockNumber.toNumber()
            }
          }
        },
        where: {
          id: idx.toNumber()
        }
      })
    } else {
      const sessionCreateInput = {
        id: idx.toNumber(),
        start: { 
          connect: {
            number: blockNumber.toNumber()
          }
        },
        end: null
      }
  
      await prisma.createSession(sessionCreateInput);
    }
  }
}

/*
*  ======= Table (Era) ======
*/
const createEra: Task<NomidotEra> = {
  read: async (blockNumber: BlockNumber, blockHash: Hash, api: ApiPromise): Promise<NomidotEra> => {
    const idx = await api.query.staking.currentEra.at(blockHash);
    const points = await api.query.staking.currentEraPointsEarned.at(blockHash);
    const currentEraStartSessionIndex = await api.query.staking.currentEraStartSessionIndex.at(blockHash);

    return {
      idx,
      points,
      startSessionIndex: currentEraStartSessionIndex
    }
  },
  write: async (value: NomidotEra) => {
    const { idx, points, startSessionIndex } = value;

    await prisma.createEra({
      id: idx.toNumber(),
      totalPoints: points.total.toHex(),
      individualPoints: {
        set: points.individual.map(points => points.toHex())
      },
      eraStartSessionIndex: {
        connect: {
          id: startSessionIndex.toNumber()
        }
      }
    })
  }
}

/*
*  ======= Table (Slashing) ======
*/
const createSlashing: Task<NomidotSlashing[]> = {
  read: async (blockNumber: BlockNumber, blockHash: Hash, api: ApiPromise): Promise<NomidotSlashing[]> => {
    const eventsAtBlock: Vec<EventRecord> = await api.query.system.events.at(blockHash);

    const slashEvents = eventsAtBlock.filter(({ event: { section, method } }) => {
      section === 'staking' && method === 'slash'
    });

    let result: NomidotSlashing[] = [];

    slashEvents.map(({ event: { data }}) => {
      result.push({
        blockNumber,
        who: createType('AccountId', data[0].toString()),
        amount: createType('Balance', data[1].toString())
      })
    })

    return result;
  },
  write: async (value: NomidotSlashing[]) => {
    value.forEach(async (slashEvent) => {
      const { blockNumber, who, amount } = slashEvent;

      await prisma.createSlashing({
        blockNumber: {
          connect: {
            number: blockNumber.toNumber()
          }
        },
        reason: who.toHex(),
        amount: amount.toNumber()
      })
    })
  }
}


const nomidotTasks: Task<Nomidot>[] = [
  createBlockNumber,
  createEra,
  createSession,
  createSlashing,
  createTotalIssuance,
  createValidator
];

export default nomidotTasks;