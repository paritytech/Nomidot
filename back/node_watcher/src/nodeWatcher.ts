// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { getSpecTypes } from '@polkadot/types/known';
import { logger } from '@polkadot/util';

import { prisma } from './generated/prisma-client';
import { Cached, NomidotTask } from './tasks/types';

const ARCHIVE_NODE_ENDPOINT =
  process.env.ARCHIVE_NODE_ENDPOINT || 'wss://kusama-rpc.polkadot.io/';
const MAX_LAG = process.env.MAX_LAG || 0;

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

function waitLagLimit(
  api: ApiPromise,
  lastKnownBestBlock: number
): Promise<number> {
  return new Promise(resolve => {
    async function wait(): Promise<void> {
      await api.derive.chain.bestNumber(best => {
        if (best.toNumber() > lastKnownBestBlock) {
          resolve(best.toNumber());
        }
      });
    }

    wait();
  });
}

function reachedLimitLag(
  lastKnownBestFinalized: number,
  lastKnownBestBlock: number
): boolean {
  return MAX_LAG
    ? lastKnownBestBlock - lastKnownBestFinalized > parseInt(MAX_LAG)
    : false;
}

async function incrementor(
  api: ApiPromise,
  provider: WsProvider,
  tasks: NomidotTask[]
): Promise<void> {
  const blockIdentifier = process.env.BLOCK_IDENTIFIER || 'IDENTIFIER';
  let blockIndexId = '';
  let blockIndex = parseInt(process.env.START_FROM || '0');
  let currentSpecVersion = api.createType('u32', -1);
  let lastKnownBestFinalized = 0;
  let lastKnownBestBlock = 0;

  await api.derive.chain.bestNumberFinalized(bestFinalized => {
    lastKnownBestFinalized = bestFinalized.toNumber();
  });

  await api.derive.chain.bestNumber(best => {
    lastKnownBestBlock = best.toNumber();
  });

  const existingBlockIndex = await prisma.blockIndexes({
    where: {
      identifier: blockIdentifier,
    },
  });

  if (existingBlockIndex.length === 0) {
    const result = await prisma.createBlockIndex({
      identifier: blockIdentifier,
      startFrom: blockIndex,
      index: blockIndex,
    });

    blockIndexId = result.id;
  } else {
    blockIndexId = existingBlockIndex[0].id;
    blockIndex = existingBlockIndex[0].index;
  }

  api.once('disconnected', () => {
    process.exit(1);
  });

  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    if (MAX_LAG) {
      // if a MAX_LAG is set, we reached the last finalized block
      // but haven't reached the lag limit yet, we need to wait
      if (
        blockIndex > lastKnownBestFinalized &&
        !reachedLimitLag(lastKnownBestFinalized, lastKnownBestBlock)
      ) {
        l.warn(`Waiting for finalization or a max lag of ${MAX_LAG} blocks.`);
        lastKnownBestBlock = await waitLagLimit(api, lastKnownBestBlock);
        continue;
      }
    } else {
      if (blockIndex > lastKnownBestFinalized) {
        l.warn('Waiting for finalization.');
        lastKnownBestFinalized = await waitFinalized(
          api,
          lastKnownBestFinalized
        );
        continue;
      }
    }
    if (
      blockIndex > lastKnownBestFinalized &&
      !reachedLimitLag(lastKnownBestFinalized, lastKnownBestBlock)
    ) {
      l.warn(
        `Waiting for finalization, or reaching a lag of ${MAX_LAG} blocks`
      );
      lastKnownBestFinalized = await waitFinalized(api, lastKnownBestFinalized);
      continue;
    }

    l.warn(`blockIndex: ${blockIndex}`);
    l.warn(`lastKnownBestBlock: ${lastKnownBestBlock}`);
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
      api.registry.register(getSpecTypes(api.registry, chain, runtimeVersion));

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
        // Write task might throw errors such as unique constraints violated,
        // we ignore those.
        l.error(e);
      }
    }

    blockIndex += 1;

    await prisma.updateBlockIndex({
      data: {
        index: blockIndex,
      },
      where: {
        id: blockIndexId,
      },
    });
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

  return incrementor(api, provider, tasks);
}
