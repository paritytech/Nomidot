// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from '@polkadot/extension-inject/types';
import React, { createContext, useState } from 'react';

interface AccountsContext {
  accounts: InjectedAccountWithMeta[];
  readonly extension: InjectedExtension;
  fetchAccounts: () => Promise<void>;
  isExtensionReady: boolean;
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
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [extension, setExtension] = useState<InjectedExtension>();
  const [isReady, setIsReady] = useState(false);

  /**
   * Fetch accounts from the extension
   */
  async function fetchAccounts(): Promise<void> {
    const extensions = await web3Enable(originName);

    if (!extensions.length) {
      throw new Error(
        'No extension found. Please install PolkadotJS extension.'
      );
    }

    setExtension(extensions[0]);
    setIsReady(true);
    setAccounts(await web3Accounts());
  }

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        get extension(): InjectedExtension {
          if (!extension) {
            throw new Error(
              'Please use `extension` only after `isReady` is set to true'
            );
          }

          return extension;
        },
        fetchAccounts,
        isExtensionReady: isReady,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}
