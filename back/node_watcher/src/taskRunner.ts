// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { getSpecTypes } from '@polkadot/types-known';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';

import { nomidotTasks } from './tasks';
import { Cached } from './tasks/types';

const l = logger('node-watcher');

const ARCHIVE_NODE_ENDPOINT =
  process.env.ARCHIVE_NODE_ENDPOINT || 'wss://kusama-rpc.polkadot.io/';

const runTask = async (blockIndex: number): Promise<void> => {
  const provider = new WsProvider(ARCHIVE_NODE_ENDPOINT);
  const api = await ApiPromise.create({ provider });

  let currentSpecVersion = api.createType('u32', -1);

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
    api.registry.register(
      getSpecTypes(
        api.registry,
        chain,
        runtimeVersion.specName,
        runtimeVersion.specVersion
      )
    );
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
  for await (const task of nomidotTasks) {
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
};

export const taskRunner = (req: Request, res: Response): void => {
  console.log(req.body.blockIndex);
  runTask(req.body.blockIndex)
    .then(() => {
      res.json({
        result: 'success',
      });
    })
    .catch(error => {
      res.status(500).json({
        error: error.message,
      });
    });
};

if (require.main === module) {
  const app = express();

  app.use(bodyParser.json());
  app.use('/runtask', taskRunner);

  app.listen(Number(process.env.PORT), () => {
    console.log(`App is running at http://localhost:${process.env.PORT}`);
    console.log('Press CTRL-C to stop\n');
  });
}
