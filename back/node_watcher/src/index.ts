// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'symbol-observable';
import { ApiRx, WsProvider } from '@polkadot/api';
import { AccountId, BlockNumber, Hash } from '@polkadot/types/interfaces';

import { combineLatest, Subscription, Observable, of } from 'rxjs';
import { first, mergeMap, switchMap, tap } from 'rxjs/operators';

import { prisma } from '../generated/prisma-client';

const ENDPOINT = 'ws://127.0.0.1:9944';

async function main () {
  const provider = new WsProvider(ENDPOINT);
  const api = new ApiRx({provider});

  api.on('connected', () => {
    console.log('api connected');
  })

  api.on('ready', () => {
    api.queryMulti<[AccountId, BlockNumber]>([
      api.query.authorship.author,
      api.query.system.number,
    ])
    .pipe(
      mergeMap(async ([authored_by, block_number]) => {
        const block_hash = api.query.system.blockHash(block_number).pipe(first());
        return [authored_by, block_number, block_hash]
      }),
      tap(([authored_by, block_number, block_hash]) => console.log(authored_by, block_number, block_hash))
    )
    .subscribe(async ([authored_by, block_number, block_hash]) => {
      await prisma.createBlockNumber({
        number: parseInt(block_number.toString()),
        authored_by: authored_by.toString(),
        start_datetime: new Date().toISOString(),
        hash: block_hash.toString()
      })
    })
  });
}

main().catch(e => console.error(e))