// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'symbol-observable';
import { ApiRx, WsProvider } from '@polkadot/api';

import PrismaWriterQueue from './PrismaWriterQueue';
import { subscribeBlockNumber } from './node-api';

const ENDPOINT = 'ws://127.0.0.1:9944';

async function main () {
  const provider = new WsProvider(ENDPOINT);
  const api = new ApiRx({provider});
  const writerQueueRunner = new PrismaWriterQueue();

  api.on('connected', () => {
    console.log('api connected');
  })

  api.on('ready', () => {
    console.log('API is ready!');

    subscribeBlockNumber(api).subscribe(async ([authored_by, block_number, block_hash]) => {
      
    })
  });
}

main().catch(e => console.error(e))