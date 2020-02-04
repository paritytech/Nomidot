// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import React, { createContext, useState } from 'react';

interface AccountsContext {
  fetchAccounts: () => Promise<void>;
  injectedAccounts: InjectedAccountWithMeta[];
}

export const AccountsContext = createContext({} as AccountsContext);

interface Props {
  children: React.ReactElement;
  /**
   * Slug specific to your app,
   * @see https://github.com/polkadot-js/extension/tree/master/packages/extension-inject#polkadotextension-inject
   */
  originName: string;
}

export function AccountsContextProvider(props: Props): React.ReactElement {
  const { children, originName } = props;
  const [injectedAccounts, setInjected] = useState<InjectedAccountWithMeta[]>(
    []
  );

  /**
   * Fetch accounts from the extension
   */
  async function fetchAccounts(): Promise<void> {
    await web3Enable(originName);

    setInjected(await web3Accounts());
  }

  return (
    <AccountsContext.Provider value={{ fetchAccounts, injectedAccounts }}>
      {children}
    </AccountsContext.Provider>
  );
}
