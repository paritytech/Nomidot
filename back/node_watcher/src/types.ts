
import { AccountId, BlockNumber, Hash } from '@polkadot/types/interfaces';


export interface BlockInfoFromNode {
  authored_by: AccountId,
  block_number: BlockNumber,
  block_hash: Hash
}