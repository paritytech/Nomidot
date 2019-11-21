// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  AccountsContextProvider,
  AlertsContextProvider,
  ApiContextProvider,
  StakingContextProvider,
  TxQueueContextProvider,
} from '@substrate/context/src';
import { Loading } from '@substrate/ui-components/src';
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
          <ApiContextProvider loading={<Loading active inline />}>
            <StakingContextProvider>{children}</StakingContextProvider>
          </ApiContextProvider>
        </TxQueueContextProvider>
      </AccountsContextProvider>
    </AlertsContextProvider>
  );
}
