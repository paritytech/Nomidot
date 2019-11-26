
import { AccountId, BlockNumber, Hash } from '@polkadot/types/interfaces';


export interface BlockInfoFromNode {
  authored_by: AccountId,
  block_number: BlockNumber,
  block_hash: Hash
}

export interface NodeWatcherOptions {
  [x: string]: (data: any) => Promise<any>; // FIXME any
}

export interface PrismaEntry {
  table: PrismaTable,
  data: any
}

type PrismaTable = 'blockNumber' | 'imOnline' | 'rewards' | 'slashing' | 'nominations' | 'stake' | 'validations' | 'sessions' | 'totalIssuance'