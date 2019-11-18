// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRx, WsProvider } from '@polkadot/api';
import { logger } from '@polkadot/util';
import {
  AccountsContextProvider,
  AlertsContextProvider,
  ApiContext,
  StakingContextProvider,
  System,
  TxQueueContextProvider,
} from '@substrate/context/src';
import React, { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

interface State {
  isReady: boolean;
  system: System;
}

const INIT_ERROR = new Error(
  'Please wait for `isReady` before fetching this property'
);

const DISCONNECTED_STATE_PROPERTIES = {
  isReady: false,
  system: {
    get chain(): never {
      throw INIT_ERROR;
    },
    get health(): never {
      throw INIT_ERROR;
    },
    get name(): never {
      throw INIT_ERROR;
    },
    get properties(): never {
      throw INIT_ERROR;
    },
    get version(): never {
      throw INIT_ERROR;
    },
  },
};

// Hardcode default to Kusama
const WS_URL = 'wss://kusama-rpc.polkadot.io/';

const l = logger('context');

const api = new ApiRx({ provider: new WsProvider(WS_URL) });

export function ContextGate(props: {
  children: React.ReactNode;
}): React.ReactElement {
  const { children } = props;
  const [state, setState] = useState<State>(DISCONNECTED_STATE_PROPERTIES);
  const { isReady, system } = state;

  useEffect(() => {
    // Block the UI when disconnected
    api.isConnected.pipe(filter(isConnected => !isConnected)).subscribe(() => {
      setState(DISCONNECTED_STATE_PROPERTIES);
    });

    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    api.isConnected
      .pipe(
        filter(isConnected => !!isConnected),
        // API needs to be ready to be able to use RPCs; connected isn't enough
        switchMap(() => api.isReady),
        switchMap(() =>
          combineLatest([
            api.rpc.system.chain(),
            api.rpc.system.health(),
            api.rpc.system.name(),
            api.rpc.system.properties(),
            api.rpc.system.version(),
          ])
        )
      )
      .subscribe(([chain, health, name, properties, version]) => {
        l.log(`Api connected to ${WS_URL}`);
        l.log(
          `Api ready, connected to chain "${chain}" with properties ${JSON.stringify(
            properties
          )}`
        );

        setState({
          ...state,
          isReady: true,
          system: {
            chain: chain.toString(),
            health,
            name: name.toString(),
            properties,
            version: version.toString(),
          },
        });
      });
  }, [state]);

  return (
    <AlertsContextProvider>
      <AccountsContextProvider>
        <TxQueueContextProvider>
          <ApiContext.Provider
            value={{
              api: api,
              isReady,
              system,
            }}
          >
            <StakingContextProvider>{children}</StakingContextProvider>
          </ApiContext.Provider>
        </TxQueueContextProvider>
      </AccountsContextProvider>
    </AlertsContextProvider>
  );
}
