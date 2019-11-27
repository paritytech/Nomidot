import { ApiPromise } from '@polkadot/api';
import { UInt } from '@polkadot/types';
import {
  AccountId,
  BlockNumber,
  Hash,
  Moment,
} from '@polkadot/types/interfaces';

import { prisma } from '../generated/prisma-client';
import { NomidotBlock, Task } from './types';

const createBlockNumber: Task<NomidotBlock> = {
  read: async (number: number, api: ApiPromise): Promise<NomidotBlock> => {
    const blockNumber: BlockNumber = new UInt(number) as BlockNumber;
    const hash: Hash = await api.query.system.blockHash(blockNumber);
    const authoredBy: AccountId = await api.query.authorship.author.at(hash);
    const startDateTime: Moment = await api.query.timestamp.now.at(hash);

    const result: NomidotBlock = {
      authoredBy,
      blockNumber,
      hash,
      startDateTime,
    };

    return result;
  },
  write: async (value: NomidotBlock) => {
    const { authoredBy, blockNumber, hash, startDateTime } = value;

    const blockNumberCreateInput = {
      authoredBy: authoredBy.toHex(),
      number: parseInt(blockNumber.toString()),
      hash: hash.toHex(),
      startDateTime: new Date(startDateTime.toNumber() * 1000).toISOString(),
    };

    console.log(`block number create input: ${blockNumberCreateInput}`);

    try {
      await prisma.createBlockNumber(blockNumberCreateInput);
    } catch (e) {
      console.error(`something went wrong trying to write: ${e}`);
    }
  },
};

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

const nomidotTasks: Task<any>[] = [createBlockNumber];

export default nomidotTasks;
