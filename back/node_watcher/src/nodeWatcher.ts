// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { getChainTypes } from '@polkadot/types/known';
import { logger } from '@polkadot/util';

import { Cached, NomidotTask } from './tasks/types';

const ARCHIVE_NODE_ENDPOINT =
  process.env.ARCHIVE_NODE_ENDPOINT || 'wss://kusama-rpc.polkadot.io/';

const l = logger('node-watcher');

function waitFinalized(
  api: ApiPromise,
  lastKnownBestFinalized: number
): Promise<number> {
  return new Promise(resolve => {
    async function wait(): Promise<void> {
      await api.derive.chain.bestNumberFinalized(best => {
        if (best.toNumber() > lastKnownBestFinalized) {
          resolve(best.toNumber());
        }
      });
    }

    wait();
  });
}

async function incrementor(
  api: ApiPromise,
  provider: WsProvider,
  tasks: NomidotTask[]
): Promise<void> {
  let blockIndex = parseInt(process.env.START_FROM || '0');
  let currentSpecVersion = api.createType('u32', -1);
  let lastKnownBestFinalized = await waitFinalized(api, 0);

  api.once('disconnected', async () => {
    try {
      api = await ApiPromise.create({ provider });
    } catch (e) {
      throw new Error(e + ' --- ' + blockIndex);
    }
  });

  while (true) {
    if (blockIndex > lastKnownBestFinalized) {
      lastKnownBestFinalized = await waitFinalized(api, lastKnownBestFinalized);
      l.warn(`WAITING FINALIZED.`);
      continue;
    }

    l.warn(`blockIndex: ${blockIndex}`);
    l.warn(`lastKnownBestFinalized: ${lastKnownBestFinalized}`);

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
      currentSpecVersion = newSpecVersion;

      // based on the node spec & chain, inject specific type overrides
      const chain = await api.rpc.system.chain();
      api.registry.register(getChainTypes(chain, runtimeVersion));

      api.registry.setMetadata(rpcMeta);
    }

    const [events, sessionIndex] = await Promise.all([
      await api.query.system.events.at(blockHash),
      await api.query.session.currentIndex.at(blockHash),
    ]);

    const cached: Cached = {
      events,
      sessionIndex,
    };

    // execute watcher tasks
    for await (const task of tasks) {
      l.warn(`Task --- ${task.name}`);

      const result = await task.read(blockHash, cached, api);

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

  incrementor(api, provider, tasks);
}
