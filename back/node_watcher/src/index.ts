// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { logger } from '@polkadot/util';
import pRetry from 'p-retry';

import { nodeWatcher } from './nodeWatcher';

const l = logger('main');

async function main(): Promise<void> {
  const ARCHIVE_NODE_ENDPOINT =
    process.env.ARCHIVE_NODE_ENDPOINT || 'wss://kusama-rpc.polkadot.io/';

  const provider = new WsProvider(ARCHIVE_NODE_ENDPOINT);
  const api = await ApiPromise.create({ provider });

  await pRetry(() => nodeWatcher(api), {
    onFailedAttempt: error => {
      console.log(
        `Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
      );
    },
    retries: 10,
  });
}

main().catch(e => {
  l.error(e);
  process.exit(1);
});
