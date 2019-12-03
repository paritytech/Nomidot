// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
// import { TypeRegistry } from '@polkadot/types';

// import nomidotTasks from './nomidot-tasks';

const parityKusama = 'wss://kusama-rpc.polkadot.io/';

// Just try all the Task I/O's for one or two blocks at each spec version bump.
describe('Nomidot Tasks', () => {
  let api: ApiPromise;

  beforeEach(
    async (done): Promise<void> => {
      api = await ApiPromise.create({ provider: new WsProvider(parityKusama) });
      done();
    }
  );

  it('should read a single task', async done => {
    const intentions = await api.query.staking.validators();

    console.error(JSON.parse(JSON.stringify(intentions)));

    done();
  });
});
