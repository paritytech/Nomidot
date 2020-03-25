// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from '@polkadot/extension-inject/types';
import {
  Option
} from '@polkadot/types';
import {
  AccountId,
  StakingLedger
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ApiContext } from './ApiContext';
import { SystemContext } from './SystemContext';
import { IS_SSR } from './util';

interface AccountsContext {
  allAccounts: InjectedAccountWithMeta[];
  allControllers?: Option<StakingLedger>[];
  allStashes?: Option<AccountId>[];
  currentAccount?: string;
  readonly extension: InjectedExtension;
  fetchAccounts: () => Promise<void>;
  isExtensionReady: boolean;
  setCurrentAccount: React.Dispatch<React.SetStateAction<string | undefined>>;
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
  const { apiPromise, isApiReady } = useContext(ApiContext);
  const { chain } = useContext(SystemContext);
  const [allAccounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [allStashes, setStashes] = useState<Option<AccountId>[]>();
  const [allControllers, setControllers] = useState<Option<StakingLedger>[]>();
  const [currentAccount, setCurrentAccount] = useState<string>();
  const [extension, setExtension] = useState<InjectedExtension>();
  const [isExtensionReady, setIsExtensionReady] = useState(false);

  const getStashControllerInfo = async () => {
    if (apiPromise && allAccounts) {
      const addresses = allAccounts.map(account => account.address);
      const ownBonded = await apiPromise.query.staking?.bonded.multi(addresses) as Option<AccountId>[];
      const ownLedger = await apiPromise.query.staking?.ledger.multi(addresses) as Option<StakingLedger>[];

      setStashes(ownBonded);
      setControllers(ownLedger);
    }
  }

  useEffect(() => {
    getStashControllerInfo();
  }, [allAccounts, apiPromise])

  /**
   * Fetch accounts from the extension
   */
  const fetchAccounts = useCallback(async () => {
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
      setIsExtensionReady(true);
    }
  }, [chain, originName]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <AccountsContext.Provider
      value={{
        allAccounts,
        allControllers,
        allStashes,
        currentAccount,
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
        isExtensionReady,
        setCurrentAccount
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}
