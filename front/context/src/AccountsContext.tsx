// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStakingAccount } from '@polkadot/api-derive/types';
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from '@polkadot/extension-inject/types';
import { logger } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { distinctUntilChanged, take } from 'rxjs/operators';

import { ApiContext } from './ApiContext';
import { SystemContext } from './SystemContext';
import { IS_SSR } from './util';

export interface DecoratedAccount
  extends InjectedAccountWithMeta,
    DerivedStakingAccount {}

interface AccountsContext {
  accounts: InjectedAccountWithMeta[];
  currentAccount?: string;
  decoratedAccounts: DecoratedAccount[];
  readonly extension: InjectedExtension;
  fetchAccounts: () => Promise<void>;
  isExtensionReady: boolean;
  setCurrentAccount: React.Dispatch<any>;
}

const l = logger('accounts-context');

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
  const { api, isApiReady } = useContext(ApiContext);
  const { chain } = useContext(SystemContext);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [currentAccount, setCurrentAccount] = useState<string>()
  const [decoratedAccounts, setDecoratedAccounts] = useState<
    DecoratedAccount[]
  >([]);
  const [extension, setExtension] = useState<InjectedExtension>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isApiReady || !accounts) {
      return;
    } else {
      // make sure it's encoded correctly
      accounts.map((account: InjectedAccountWithMeta) => {
        account.address = encodeAddress(decodeAddress(account.address), 2);

        const sub = api.derive.staking
          .account(account.address)
          .pipe(take(1), distinctUntilChanged())
          .subscribe((derivedStakingAccount: DerivedStakingAccount) => {
            setDecoratedAccounts([
              ...decoratedAccounts,
              {
                ...account,
                ...derivedStakingAccount,
              },
            ]);
          });

        return () => sub.unsubscribe();
      });
    }
  }, [accounts, isApiReady]);

  /**
   * Fetch accounts from the extension
   */
  async function fetchAccounts(): Promise<void> {
    if (typeof window !== `undefined`) {
      const { web3Accounts, web3Enable } = await import(
        '@polkadot/extension-dapp'
      );

      const extensions = await web3Enable(originName);

      if (!extensions.length) {
        throw new Error(
          'No extension found. Please install PolkadotJS extension.'
        );
      }

      if (IS_SSR) {
        throw new Error('Window does not exist during SSR');
      }

      setExtension(extensions[0]);

      const _web3Accounts = await web3Accounts();

      _web3Accounts.map((account: InjectedAccountWithMeta) => {
        account.address = encodeAddress(decodeAddress(account.address), 2);
      });

      setAccounts(_web3Accounts);
      setCurrentAccount(
        _web3Accounts && _web3Accounts[0] && _web3Accounts[0].address
      );

      l.log(`Accounts ready, encoded to ss58 prefix of ${chain}`);
      setIsReady(true);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <AccountsContext.Provider
      value={{
        accounts,
        currentAccount,
        decoratedAccounts,
        get extension(): InjectedExtension {
          if (!extension) {
            throw new Error(
              'Please use `extension` only after `isExtensionReady` is set to true'
            );
          }

          if (IS_SSR) {
            throw new Error('Window does not exist during SSR');
          }

          return extension;
        },
        fetchAccounts,
        isExtensionReady: isReady,
        setCurrentAccount
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}
