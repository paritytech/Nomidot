// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  AccountsContextProvider,
  AlertsContextProvider,
  ApiContextProvider,
  StakingContextProvider,
  TxQueueContextProvider,
} from '@substrate/context';
import React from 'react';

export function ContextGate({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <AlertsContextProvider>
      <AccountsContextProvider>
        <TxQueueContextProvider>
          <ApiContextProvider>
            <StakingContextProvider>{children}</StakingContextProvider>
          </ApiContextProvider>
        </TxQueueContextProvider>
      </AccountsContextProvider>
    </AlertsContextProvider>
  );
}
