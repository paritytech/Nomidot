// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { logger } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

import { ApiRxContextProviderProps } from './types';

export interface ApiPromiseContextType {
  api: ApiPromise | undefined; // From @polkadot/api\
  isApiReady: boolean;
}

const l = logger('api-context');

export const ApiPromiseContext: React.Context<ApiPromiseContextType> = React.createContext(
  {} as ApiPromiseContextType
);

export function ApiPromiseContextProvider(
  props: ApiRxContextProviderProps
): React.ReactElement {
  const { children = null, provider } = props;
  const [apiPromise, setApiPromise] = useState<ApiPromise>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    setApiPromise(new ApiPromise({ provider }));

    setIsReady(false);
  }, [provider]);

  useEffect(() => {
    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    if (apiPromise) {
      apiPromise.isReady.then(_ => {
        l.log(`Api ready.`);
        setIsReady(true);
      });
    }
  }, [apiPromise]);

  return (
    <ApiPromiseContext.Provider
      value={{ api: apiPromise, isApiReady: isReady }}
    >
      {children}
    </ApiPromiseContext.Provider>
  );
}
