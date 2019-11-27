
import { ApiPromise } from '@polkadot/api';
import { AccountId, BlockNumber, BabeAuthorityWeight, Hash, Moment } from '@polkadot/types/interfaces';
import { UInt, Vec } from '@polkadot/types';
import { ITuple } from '@polkadot/types/types';
import { NomidotBlock, NomidotHeartBeat, Task } from './types';
import { prisma } from '../generated/prisma-client';

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
      startDateTime
    };

    console.log(`read all this stuff: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (value: NomidotBlock) => {
    const { authoredBy, blockNumber, hash, startDateTime } = value;

    const author = authoredBy.toHex();
    const dt = new Date(startDateTime.toNumber() * 1000).toISOString();
    const hashish = hash.toHex();
    const number = parseInt(blockNumber.toString());
    
    const blockNumberCreateInput = {
      authoredBy: author,
      number,
      hash: hashish,
      startDateTime: dt
    }

    console.log(`block number create input: ${blockNumberCreateInput}`);

    try {
      await prisma.createBlockNumber(blockNumberCreateInput);
    } catch (e) {
      console.error(`something went wrong trying to write: ${e}`);
    }
  }
}

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


let nomidotTasks: Task<any>[] = [
  createBlockNumber
];

export default nomidotTasks;