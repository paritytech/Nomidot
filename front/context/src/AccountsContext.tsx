// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  DeriveBalancesAll,
  DeriveStakingQuery,
} from '@polkadot/api-derive/types';
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from '@polkadot/extension-inject/types';
import { Option } from '@polkadot/types';
import { AccountId, StakingLedger } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import { decodeAddress, encodeAddress } from '@polkadot/util-crypto';
import { writeStorage } from '@substrate/local-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { ApiPromiseContext, SystemContext } from './index';
import { getStashes, IS_SSR } from './util';

type AccountBalanceMap = Record<string, DeriveBalancesAll>;
type StashControllerMap = Record<string, DeriveStakingQuery>;

interface AccountsContext {
  accountBalanceMap: AccountBalanceMap;
  allAccounts: InjectedAccountWithMeta[];
  // allControllers: StakingLedger[];
  allStashes: string[];
  currentAccount?: string;
  readonly extension: InjectedExtension;
  fetchAccounts: () => Promise<void>;
  isExtensionReady: boolean;
  loadingAccountStaking: boolean;
  loadingBalances: boolean;
  setCurrentAccount: React.Dispatch<React.SetStateAction<string | undefined>>;
  stashControllerMap: StashControllerMap;
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

  // context
  const { api, isApiReady } = useContext(ApiPromiseContext);
  const { chain } = useContext(SystemContext);

  // state
  const [allAccounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [accountBalanceMap, setAccountBalanceMap] = useState<AccountBalanceMap>(
    {}
  );
  const [allStashes, setAllStashes] = useState<string[]>([]);
  const [stashControllerMap, setStashControllerMap] = useState<
    StashControllerMap
  >({});
  const [currentAccount, setCurrentAccount] = useState<string>();
  const [extension, setExtension] = useState<InjectedExtension>();
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loadingAccountStaking, setLoadingAccountStaking] = useState(true);
  const [isExtensionReady, setIsExtensionReady] = useState(false);

  const getDerivedBalances = async () => {
    if (allAccounts && api && isApiReady) {
      setLoadingBalances(true);
      const addresses = allAccounts.map(account => account.address);

      const result: AccountBalanceMap = {};

      await Promise.all(
        addresses.map(async (address: string) => {
          const derivedBalances = await api.derive.balances.all(address);

          result[address] = derivedBalances;
        })
      );

      setAccountBalanceMap(result);
      writeStorage('derivedBalances', JSON.stringify(result));
      setLoadingBalances(false);
    }
  };

  const getDerivedStaking = async () => {
    if (allStashes && api && isApiReady) {
      const result: StashControllerMap = {};

      await Promise.all(
        allStashes.map(async stashId => {
          const stakingInfo = await api.derive.staking.query(stashId);

          result[stashId] = stakingInfo;
        })
      );

      setStashControllerMap(result);
      writeStorage('derivedStaking', JSON.stringify(result));
    }
  };

  const getStashInfo = async () => {
    if (isApiReady && api && allAccounts) {
      setLoadingAccountStaking(true);
      const addresses = allAccounts.map(account => account.address);

      const allBonded: Option<
        AccountId
      >[] = await api.query.staking?.bonded.multi(addresses);
      const allLedger: Option<
        StakingLedger
      >[] = await api.query.staking.ledger.multi(addresses);

      const stashes: string[] = getStashes(addresses, allBonded, allLedger);

      writeStorage('allStashes', JSON.stringify(stashes));

      setAllStashes(stashes);

      setLoadingAccountStaking(false);
    }
  };

  /**
   * Fetch accounts from the extension
   */
  const fetchAccounts = useCallback(async () => {
    if (typeof window !== `undefined`) {
      const { web3Accounts, web3Enable } = await import(
        '@polkadot/extension-dapp'
      );

      const extensions: InjectedExtension[] = await web3Enable(originName);

      if (!extensions.length) {
        throw new Error(
          'No extension found. Please install PolkadotJS extension.'
        );
      }

      if (IS_SSR) {
        throw new Error('Window does not exist during SSR');
      }

      setExtension(extensions[0]); // accounts, signer

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

  const setSigner = () => {
    if (api && extension && isExtensionReady) {
      api.setSigner(extension.signer);
    }
  };
  const fetchCachedRpcResults = () => {
    const cachedStashes = localStorage.getItem('allStashes');
    const cachedBalances = localStorage.getItem('derivedBalances');
    const cachedStaking = localStorage.getItem('derivedStaking');

    if (cachedStashes) {
      const asStashArray = JSON.parse(cachedStashes) as string[];
      setAllStashes(asStashArray);
    }

    if (cachedBalances) {
      setAccountBalanceMap(JSON.parse(cachedBalances) as AccountBalanceMap);
    }

    if (cachedStaking) {
      setStashControllerMap(JSON.parse(cachedStaking) as StashControllerMap);
    }
  };

  useEffect(() => {
    setSigner();
  }, [isExtensionReady]);

  useEffect(() => {
    fetchAccounts();
    fetchCachedRpcResults();
  }, []);

  useEffect(() => {
    getStashInfo();
  }, [allAccounts, api, isApiReady]);

  useEffect(() => {
    getDerivedStaking();
    getDerivedBalances();
  }, [allStashes, api, isApiReady]);

  return (
    <AccountsContext.Provider
      value={{
        accountBalanceMap,
        allAccounts,
        // allControllers,
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
        loadingAccountStaking,
        loadingBalances,
        setCurrentAccount,
        stashControllerMap,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}
