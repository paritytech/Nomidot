import { ApiPromise } from '@polkadot/api';
import {
  AccountId,
  Balance,
  BlockNumber,
  Hash,
  Moment,
  SessionIndex,
} from '@polkadot/types/interfaces';

export interface BlockData {
  [x: string]: any;
}

export interface PrismaEntry {
  table: PrismaTable;
  data: BlockData;
}

type PrismaTable =
  | 'blockNumber'
  | 'imOnline'
  | 'rewards'
  | 'slashing'
  | 'nominations'
  | 'stake'
  | 'validations'
  | 'sessions'
  | 'totalIssuance';

export interface Task<T> {
  read(blockNumber: number, api: ApiPromise): Promise<T>;
  write(value: T): Promise<void>;
}

export interface NomidotBlock {
  authoredBy: AccountId;
  blockNumber: BlockNumber;
  hash: Hash;
  startDateTime: Moment;
}

export interface NomidotHeartBeat {
  blockNumber: BlockNumber;
  isOnline: boolean;
  sender: AccountId;
  sessionId: SessionIndex;
}

export interface NomidotTotalIssuance {
  amount: Balance
}

export type Nomidot = NomidotBlock | NomidotHeartBeat | NomidotTotalIssuance;