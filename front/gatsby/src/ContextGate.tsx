// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { WsProvider } from '@polkadot/api';
import {
  AccountsContextProvider,
  AlertsContextProvider,
  ApiContextProvider,
  StakingContextProvider,
  TxQueueContextProvider,
} from '@substrate/context';
import React from 'react';

const ARCHIVE_NODE_ENDPOINT = 'wss://kusama-rpc.polkadot.io/';

export function ContextGate({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <AlertsContextProvider>
      <AccountsContextProvider>
        <TxQueueContextProvider>
          <ApiContextProvider provider={new WsProvider(ARCHIVE_NODE_ENDPOINT)}>
            <StakingContextProvider>{children}</StakingContextProvider>
          </ApiContextProvider>
        </TxQueueContextProvider>
      </AccountsContextProvider>
    </AlertsContextProvider>
  );
}
