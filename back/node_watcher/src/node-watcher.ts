// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType } from '@polkadot/types';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { NomidotTask } from './tasks/types';
import BN = require('bn.js');

const BLOCK_NUMBER_RANGE = Number.MAX_SAFE_INTEGER;

const l = logger('node-watcher');

function* blockIterator (start: number = 0, end: number = BLOCK_NUMBER_RANGE) {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

export async function nodeWatcher(tasks: NomidotTask[], api: ApiPromise): Promise<void> {
  const iter = blockIterator(0, 2);
  let nextBlockNumber = iter.next();
  let currSpecVersion = new BN(0);

  while(!nextBlockNumber.done) {
    l.warn(nextBlockNumber);

    const blockNumber: BlockNumber = createType(api.registry, 'BlockNumber', nextBlockNumber.value);
    l.warn(`block: ${blockNumber}`);
    const blockHash: Hash = await api.rpc.chain.getBlockHash(blockNumber.toNumber());
    l.warn(`hash: ${blockHash}`);

    // check spec version
    const runtimeVersion = await api.rpc.state.getRuntimeVersion();
    const specVersion = runtimeVersion.specVersion;
    
    // if spec version was bumped, update metadata in api registry
    if (specVersion.gt(currSpecVersion)) {
      const rpcMeta = await api.rpc.state.getMetadata(blockHash);
      api.registry.setMetadata(rpcMeta);
      currSpecVersion = specVersion;
    }

    // execute watcher tasks
    for await (let task of tasks) {
      l.warn(`running task --- ${task.name}`);

      const result = await task.read(blockNumber, blockHash, api);

      l.warn(`task.read() yielded: ${JSON.stringify(result)}`);

      try {
        await task.write(result);
      } catch (e) {
        l.error(e);
      }
    }

    nextBlockNumber = iter.next();
  }
}