// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, TypeRegistry } from '@polkadot/types';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { NomidotTask } from './tasks/types';

const BLOCK_NUMBER_RANGE = Number.MAX_SAFE_INTEGER;

const l = logger('node-watcher');

function* blockIterator (start: number = 0, end: number = BLOCK_NUMBER_RANGE) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

export async function nodeWatcher(tasks: NomidotTask[], api: ApiPromise): Promise<void> {
  const iter = blockIterator();
  let nextBlockNumber = iter.next();

  while(!nextBlockNumber.done) {
    l.log(nextBlockNumber);
    
    await Promise.all(
      tasks.map(async (task: NomidotTask) => {
        const blockNumber: BlockNumber = createType(api.registry, 'BlockNumber', nextBlockNumber.value);
        l.log(`block: ${blockNumber}`);
        const blockHash: Hash = await api.query.system.blockHash(blockNumber.toNumber());
        l.log(`hash: ${blockHash}`);

        const result = await task.read(blockNumber, blockHash, api);

        l.log(`task.read() yielded: ${JSON.stringify(result)}`);

        try {
          await task.write(result);
        } catch (e) {
          l.error(e);
        }
      })
    )

    nextBlockNumber = iter.next();
  }
}
