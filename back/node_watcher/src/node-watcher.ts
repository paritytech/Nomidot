// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { logger } from '@polkadot/util';

import { Task } from './types';

const BLOCK_NUMBER_RANGE = Number.MAX_SAFE_INTEGER;

const l = logger('node-watcher');

export function nodeWatcher(tasks: Task<any>[], api: ApiPromise) {
  // for (let number = 0; number < BLOCK_NUMBER_RANGE; number++) {
    tasks[0].read(40, api).then(result => tasks[0].write(result));
  // }
}