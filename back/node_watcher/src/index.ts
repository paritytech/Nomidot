// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { TypeRegistry } from '@polkadot/types';

import { nodeWatcher } from './node-watcher';
import nomidotTasks from './nomidot-tasks';

const ENDPOINT = 'wss://kusama-rpc.polkadot.io/';

async function main() {
  const provider = new WsProvider(ENDPOINT);
  const registry = new TypeRegistry();
  const api = new ApiPromise({ provider, registry });

  api.isReady.then(() => {
    nodeWatcher([...nomidotTasks], api).then(() => {
      return;
    });
  });
}

main().catch(e => console.error(e));
