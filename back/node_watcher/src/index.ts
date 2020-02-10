// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { logger } from '@polkadot/util';
import cluster from 'cluster';
import os from 'os';

import { nodeWatcher } from './nodeWatcher';
import { nomidotTasks } from './tasks';

const l = logger('main');

function main(): void {
  if (cluster.isMaster) {
    const cpuCount = os.cpus().length;

    // Fork workers.
    for (let i = 0; i < cpuCount; i++) {
      cluster.fork();
    }
  }

  nodeWatcher(nomidotTasks).catch(e => {
    l.error(e);
    process.exit(1);
  });
}

main();
