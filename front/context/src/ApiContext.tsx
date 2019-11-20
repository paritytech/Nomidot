// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRx, WsProvider } from '@polkadot/api';
import { ChainProperties, Health } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

export interface System {
  chain: string;
  health: Health;
  name: string;
  properties: ChainProperties;
  version: string;
}

export interface ApiContextType {
  api: ApiRx; // From @polkadot/api
  isReady: boolean; // Are api and keyring loaded?
  system: System; // Information about the chain
}

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

const l = logger('api-context');

const api = new ApiRx({ provider: new WsProvider(WS_URL) });

export const ApiContext: React.Context<ApiContextType> = React.createContext(
  {} as ApiContextType
);

export interface ApiContextProviderProps {
  children?: React.ReactNode;
  loading?: React.ReactNode;
}

export function ApiContextProvider(
  props: ApiContextProviderProps = { children: null, loading: null }
): React.ReactElement {
  const { children, loading } = props;
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
    api.isReady
      .pipe(
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
  }, []);

  return (
    <ApiContext.Provider
      value={{
        api: api,
        isReady,
        system,
      }}
    >
      {state.isReady ? children : loading}
    </ApiContext.Provider>
  );
}
