// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'symbol-observable';
import { ApiPromise, WsProvider } from '@polkadot/api';

import NodeApi from './node-api';
import NodeWatcher from './node-watcher';
import { NodeWatcherOptions } from './types';

const ENDPOINT = 'ws://127.0.0.1:9944';

async function main () {
  const provider = new WsProvider(ENDPOINT);
  const api = await new ApiPromise({ provider });

  const options: NodeWatcherOptions = {
    'block': 
  };

  api.isReady.then(() => {
    const nodeWatcher = new NodeWatcher(api, options);

    nodeWatcher.start();
  })
}

main().catch(e => console.error(e))