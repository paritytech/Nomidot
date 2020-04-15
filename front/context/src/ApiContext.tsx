// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, ApiRx } from '@polkadot/api';
import { ProviderInterface } from '@polkadot/rpc-provider/types';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

export interface ApiContextType {
  api: ApiRx; // From @polkadot/api\
  apiPromise?: ApiPromise;
  isApiReady: boolean;
}

const l = logger('api-context');

export const ApiContext: React.Context<ApiContextType> = React.createContext(
  {} as ApiContextType
);

export interface ApiType {
  withPromise?: boolean;
  withRxjs?: boolean;
}

export interface ApiContextProviderProps {
  children?: React.ReactElement;
  provider: ProviderInterface;
  type?: ApiType;
}

export function ApiContextProvider(
  props: ApiContextProviderProps
): React.ReactElement {
  const {
    children = null,
    provider,
    type = { withRxjs: true, withPromise: false },
  } = props;
  const [api, setApi] = useState<ApiRx>(new ApiRx({ provider }));
  const [apiPromise, setApiPromise] = useState<ApiPromise>(
    new ApiPromise({ provider })
  );
  const [isReady, setIsReady] = useState(false);
  const { withPromise, withRxjs } = type;

  useEffect(() => {
    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    if (!withPromise && !withRxjs) {
      l.error(
        `At least one of the api type withPromise or withRxjs should be set`
      );
    }

    if (withPromise) {
      setApiPromise(new ApiPromise({ provider }));
    }

    if (withRxjs) {
      setApi(new ApiRx({ provider }));
    }
    setIsReady(false);
  }, [provider, withPromise, withRxjs]);

  useEffect(() => {
    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    if (withPromise) {
      apiPromise.isReady.then(_ => {
        setIsReady(true);
      });
    }

    if (withRxjs) {
      const subscription = api.isReady.subscribe(() => {
        l.log(`Api ready, app is ready to use`);

        setIsReady(true);
      });

      return (): void => subscription.unsubscribe();
    }
  }, [api, apiPromise.isReady, withPromise, withRxjs]);

  return (
    <ApiContext.Provider value={{ api, apiPromise, isApiReady: isReady }}>
      {children}
    </ApiContext.Provider>
  );
}
