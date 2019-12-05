// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { NomidotTask } from './tasks/types';

const ARCHIVE_NODE_ENDPOINT = 'wss://kusama-rpc.polkadot.io/';
const l = logger('node-watcher');

async function incrementor(
  api: ApiPromise,
  tasks: NomidotTask[]
): Promise<void> {
  let blockIndex = 0;
  const currentSpecVersion = api.createType('u32', -1);

  // get last known best finalized
  let lastKnownBestFinalized = await api.derive.chain.bestNumberFinalized();

  setInterval(() => {
    async function updateFinalized() {
      lastKnownBestFinalized = await api.derive.chain.bestNumberFinalized();
      l.warn(`last known best finalized: ${lastKnownBestFinalized}`);

      if (blockIndex > lastKnownBestFinalized.toNumber()) {
        blockIndex = lastKnownBestFinalized.toNumber();
      }
    }

    updateFinalized();
  }, 5000);

  while (true) {
    if (blockIndex > lastKnownBestFinalized.toNumber()) {
      blockIndex = lastKnownBestFinalized.toNumber();
      continue;
    }

    const blockNumber: BlockNumber = api.createType('BlockNumber', blockIndex);
    l.warn(`block: ${blockNumber}`);

    const blockHash: Hash = await api.rpc.chain.getBlockHash(blockNumber);
    l.warn(`hash: ${blockHash}`);

    // check spec version
    const runtimeVersion = await api.rpc.state.getRuntimeVersion(blockHash);
    const newSpecVersion = runtimeVersion.specVersion;

    // if spec version was bumped, update metadata in api registry
    if (newSpecVersion.gt(currentSpecVersion)) {
      l.warn(`bumped spec version to ${newSpecVersion}, fetching new metadata`);
      const rpcMeta = await api.rpc.state.getMetadata(blockHash);
      api.registry.setMetadata(rpcMeta);
    }

    // execute watcher tasks
    for await (const task of tasks) {
      l.warn(`Task --- ${task.name}`);

      const result = await task.read(blockHash, api);

      try {
        l.warn(`Writing: ${JSON.stringify(result)}`);
        await task.write(blockNumber, result);
      } catch (e) {
        l.error(e);
      }
    }

    blockIndex += 1;
  }
}

/**
 * A script that watches a node, and performs some tasks at each block
 *
 * @param tasks - The list of tasks the node-watcher should perform at each
 * block
 */
export async function nodeWatcher(tasks: NomidotTask[]): Promise<void> {
  const provider = new WsProvider(ARCHIVE_NODE_ENDPOINT);
  const api = await ApiPromise.create({ provider });

  return incrementor(api, tasks);
}
