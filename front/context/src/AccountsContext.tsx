// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { isWeb3Injected, web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import React, { createContext, useEffect, useState } from 'react';

import { InjectedAccountExt } from './types';

export const AccountsContext = createContext({
  injectedAccounts: [] as InjectedAccountExt[],
  isWeb3Injected: false
});

interface Props {
  children: React.ReactNode;
}

export function AccountsContextProvider(props: Props): React.ReactElement {
  const { children } = props;
  const [injectedAccounts, setInjected] = useState<InjectedAccountExt[]>(
    [] as InjectedAccountExt[]
  );

  useEffect(() => {
    const enableWeb3 = async () => {
      return await web3Enable('nomidot');
    }

    enableWeb3();

    Promise.resolve(web3Accounts().then((accounts): InjectedAccountExt[] =>
      accounts.map(({ address, meta }): InjectedAccountExt => ({
        address,
        meta: {
          ...meta,
          name: `${meta.name} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`
        }
      }))
    )).then(injectedAccounts => setInjected(injectedAccounts));

  }, [isWeb3Injected]);

  return (
    <AccountsContext.Provider value={{ 
      injectedAccounts,
      isWeb3Injected
    }}>
      {children}
    </AccountsContext.Provider>
  );
}
