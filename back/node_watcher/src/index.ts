// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';

import { nodeWatcher } from './node-watcher';
import nomidotTasks from './nomidot-watcher';

const ENDPOINT = 'ws://127.0.0.1:9944';

async function main () {
  const provider = new WsProvider(ENDPOINT);
  const api = await new ApiPromise({ provider });;

  api.isReady.then(() => {
    nodeWatcher([...nomidotTasks], api);
  })
}

main().catch(e => console.error(e))