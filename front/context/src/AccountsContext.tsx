// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Accounts, web3Enable, isWeb3Injected } from '@polkadot/extension-dapp';
import React, { useState, createContext, useEffect } from 'react';
import { InjectedAccountExt } from './types';

export const AccountsContext = createContext({
  injectedAccounts: [] as InjectedAccountExt[]
})

interface Props {
  children: any;
}

export function AccountsContextProvider (props: Props): React.ReactElement {
  const { children } = props;
  const [injectedAccounts, setInjected] = useState<InjectedAccountExt[]>([] as InjectedAccountExt[]);

  const getInjected = async () => {
    await web3Enable('nomidot');
    const [injectedAccounts] = await Promise.all([
      web3Accounts().then((accounts): InjectedAccountExt[] =>
        accounts.map(({ address, meta }): InjectedAccountExt => ({
          address,
          meta: {
            ...meta,
            name: `${meta.name} (${meta.source === 'polkadot-js' ? 'extension' : meta.source})`
          }
        }))
      )
    ]);

    setInjected(injectedAccounts);
  }
  
  useEffect(() => {
    getInjected();
  }, [])

  return (
    <AccountsContext.Provider value={{ injectedAccounts }}>
      {children}
    </AccountsContext.Provider>
  )
}