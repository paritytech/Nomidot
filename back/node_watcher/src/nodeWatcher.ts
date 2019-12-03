// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { u32 } from '@polkadot/types';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import { ApiPromise, WsProvider } from '@polkadot/api';

import { NomidotTask } from './tasks/types';

const ARCHIVE_NODE_ENDPOINT = 'wss://kusama-rpc.polkadot.io/';
const l = logger('node-watcher');

/**
 * A script that watches a node, and performs some tasks at each block
 *
 * @param tasks - The list of tasks the node-watcher should perform at each
 * block
 */
export async function nodeWatcher(tasks: NomidotTask[]): Promise<void> {
  const provider = new WsProvider(ARCHIVE_NODE_ENDPOINT);
  const api = await ApiPromise.create({ provider });

  const initialState = {
    blockNumber: api.createType('BlockNumber', 0),
    specVersion: api.createType('u32', -1),
  };

  return incrementor(initialState, tasks, api);
}

/**
 * Object to represent the current status of the incrementor
 */
interface State {
  blockNumber: BlockNumber;
  specVersion: u32;
}

async function incrementor(
  current: State,
  tasks: NomidotTask[],
  api: ApiPromise
): Promise<void> {
  l.warn(`block: ${current.blockNumber}`);

  const blockHash: Hash = await api.rpc.chain.getBlockHash(current.blockNumber);
  l.warn(`hash: ${blockHash}`);

  // check spec version
  const runtimeVersion = await api.rpc.state.getRuntimeVersion();
  const newSpecVersion = runtimeVersion.specVersion;

  // if spec version was bumped, update metadata in api registry
  if (newSpecVersion.gt(current.specVersion)) {
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
      await task.write(current.blockNumber, result);
    } catch (e) {
      l.error(e);
    }
  }

  return incrementor(
    {
      blockNumber: api.createType('BlockNumber', current.blockNumber.addn(1)),
      specVersion: newSpecVersion,
    },
    tasks,
    api
  );
}
