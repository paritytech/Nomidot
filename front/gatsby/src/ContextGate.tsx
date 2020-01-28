// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
import {
  AccountsContextProvider,
  AlertsContextProvider,
  ApiContextProvider,
  HealthContextProvider,
  TxQueueContextProvider
} from '@substrate/context';
import { Loading } from '@substrate/ui-components';
import { HealthGate } from './HealthGate';
import React from 'react';

const ARCHIVE_NODE_ENDPOINT = 'wss://kusama-rpc.polkadot.io/';
const wsProvider = new WsProvider(ARCHIVE_NODE_ENDPOINT);

export function ContextGate({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <AlertsContextProvider>
      <AccountsContextProvider>
        <TxQueueContextProvider>
          <HealthContextProvider provider={wsProvider}>
            <HealthGate>
              <ApiContextProvider loading={<Loading active>Initializing chain...</Loading>} provider={wsProvider}>
                {children}
              </ApiContextProvider>
            </HealthGate>
          </HealthContextProvider>
        </TxQueueContextProvider>
      </AccountsContextProvider>
    </AlertsContextProvider>
  );
}
