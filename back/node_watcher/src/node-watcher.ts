// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType } from '@polkadot/types';
import {
  BlockNumber,
  Hash
} from '@polkadot/types/interfaces';

import { logger } from '@polkadot/util';

import { Task } from './types';

const BLOCK_NUMBER_RANGE = Number.MAX_SAFE_INTEGER;

const l = logger('node-watcher');

export function nodeWatcher(tasks: Task<any>[], api: ApiPromise): void {
  // This for loop is actually asynchronous since ES6: https://stackoverflow.com/questions/11488014/asynchronous-process-inside-a-javascript-for-loop
  for (let number = 0; number < BLOCK_NUMBER_RANGE; number++) {
    tasks.forEach(async (task: Task<any>) => {
      const blockNumber: BlockNumber = createType('BlockNumber', number);
      const blockHash: Hash = await api.query.system.blockHash(blockNumber); 

      const result = await task.read(blockNumber, blockHash, api);

      l.log(`task.read() yielded: ${result}`);

      try {
        await task.write(result);
      } catch (e) {
        l.error(e);
      }
    });
  }
}
