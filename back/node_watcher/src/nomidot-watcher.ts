
import { ApiPromise } from '@polkadot/api';
import { AccountId, Hash, Moment } from '@polkadot/types/interfaces';
import { NomidotBlock, Task } from './types';
import { prisma } from '../generated/prisma-client';

const createBlockNumber: Task<NomidotBlock> = {
  read: async (blockNumber: number, api: ApiPromise): Promise<NomidotBlock> => {
    const hash: Hash = await api.query.system.blockHash(blockNumber);
    const authoredBy: AccountId = await api.query.authorship.author.at(hash);
    const startDateTime: Moment = await api.query.timestamp.now.at(hash);

    return {
      authoredBy,
      blockNumber,
      hash,
      startDateTime
    } as NomidotBlock
  },
  write: async (value: NomidotBlock) => {
    await prisma.createBlockNumber({
      authoredBy: value.authoredBy.toHex(),
      number: parseInt(value.blockNumber.toString()),
      hash: value.hash.toHex(),
      startDateTime: new Date(value.startDateTime.toString()).toISOString()
    })
  }
}

// const createImOnline: Task<any> = {
//   read: () => { },
//   write: ()=>{ }
// }


let nomidotTasks: Task<any>[] = [
  createBlockNumber
];

export default nomidotTasks;