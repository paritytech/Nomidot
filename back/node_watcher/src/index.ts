// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { logger } from '@polkadot/util';
import pRetry from 'p-retry';

import { nodeWatcher } from './nodeWatcher';

const l = logger('main');

async function main(): Promise<void> {
  await pRetry(nodeWatcher, {
    onFailedAttempt: error => {
      console.log(
        `${error.message} - Retry attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`
      );
    },
    retries: 10,
  });
}

main().catch(e => {
  l.error(e);
  process.exit(1);
});
