
import { ApiPromise } from '@polkadot/api';
import { AccountId, BlockNumber, Hash, Moment } from '@polkadot/types/interfaces';

export interface BlockData {
  [x: string]: any;
}

export interface NomidotBlock {
  authoredBy: AccountId,
  blockNumber: number
  hash: Hash,
  startDateTime: Moment
}

export interface PrismaEntry {
  table: PrismaTable,
  data: BlockData
}

type PrismaTable = 'blockNumber' | 'imOnline' | 'rewards' | 'slashing' | 'nominations' | 'stake' | 'validations' | 'sessions' | 'totalIssuance'

export interface Task<T> {
  read(blockNumber: number, api: ApiPromise): Promise<T>;
  write(value: T): Promise<void>
}