// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import 'symbol-observable';
import { ApiRx, WsProvider } from '@polkadot/api';
import { AccountId, BlockNumber, Hash } from '@polkadot/types/interfaces';

import { combineLatest, Subscription, Observable, of } from 'rxjs';
import { concatMap, first, mergeMap, switchMap, take, tap } from 'rxjs/operators';

const ENDPOINT = 'ws://127.0.0.1:9944';

const registerMetadata = (api: ApiRx) => {
  const metaDataSub = api.rpc.state.getMetadata();
}

const subscribeBlockNumber = (api: ApiRx): Observable<[AccountId, BlockNumber, Hash]> => {
  const blockNumberSub: Observable<[AccountId, BlockNumber, Hash]> = combineLatest([
    api.query.authorship.author(),
    api.query.system.number(),
  ])
  .pipe(
    mergeMap(([authored_by, block_number]) =>
      combineLatest([
        of(authored_by),
        of(block_number),
        api.query.system.blockHash(block_number)
      ])
    ),
    tap(([authored_by, block_number, hash]) => {
      console.log('authored by => ', authored_by.toString());
      console.log('block number -> ', block_number.toBn());
      console.log('block hash => ', hash.toHex());
    })
  );

  return blockNumberSub;
}

async function main () {
  const provider = new WsProvider(ENDPOINT);
  const api = new ApiRx({provider});

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