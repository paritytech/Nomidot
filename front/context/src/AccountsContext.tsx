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
  accountBalanceMap: Record<string, DeriveBalancesAll>;
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
  stashControllerMap: Record<string, DeriveStakingQuery>;
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

function getStashes(
  allAccounts: string[],
  ownBonded: Option<AccountId>[],
  ownLedger: Option<StakingLedger>[]
): string[] {
  const result: string[] = [];

  ownBonded.forEach((value, index): void => {
    value.isSome && result.push(allAccounts[index]);
  });

  ownLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !result.some(([accountId]): boolean => accountId === stashId) &&
        result.push(stashId);
    }
  });

  return result;
}

export function AccountsContextProvider(props: Props): React.ReactElement {
  const { children, originName } = props;
  const { apiPromise, isApiReady } = useContext(ApiContext);
  const { chain } = useContext(SystemContext);
  const [allAccounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [accountBalanceMap, setAccountBalanceMap] = useState<
    Record<string, DeriveBalancesAll>
  >({});
  const [allStashes, setAllStashes] = useState<string[]>([]);
  const [stashControllerMap, setStashControllerMap] = useState<
    Record<string, DeriveStakingQuery>
  >({});
  const [currentAccount, setCurrentAccount] = useState<string>();
  const [extension, setExtension] = useState<InjectedExtension>();
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loadingAccountStaking, setLoadingAccountStaking] = useState(true);
  const [isExtensionReady, setIsExtensionReady] = useState(false);

  const getDerivedBalances = () => {
    if (allAccounts && apiPromise) {
      setLoadingBalances(true);
      const addresses = allAccounts.map(account => account.address);

      const result: Record<string, DeriveBalancesAll> = {};
      addresses.map(async (address: string) => {
        const derivedBalances = await apiPromise.derive.balances.all(address);

        result[address] = derivedBalances;
      });

      setAccountBalanceMap(result);
      setLoadingBalances(false);
    }
  };

  const getDerivedStaking = () => {
    if (allStashes && apiPromise) {
      const result: Record<string, DeriveStakingQuery> = {};
      allStashes.map(async stashId => {
        const stakingInfo = await apiPromise.derive.staking.query(stashId);

        result[stashId] = stakingInfo;
      });

      setStashControllerMap(result);
    }
  };

  const getStashInfo = async () => {
    if (isApiReady && apiPromise && allAccounts) {
      setLoadingAccountStaking(true);
      const addresses = allAccounts.map(account => account.address);

      const allBonded: Option<
        AccountId
      >[] = await apiPromise.query.staking?.bonded.multi(addresses);
      const allLedger: Option<
        StakingLedger
      >[] = await apiPromise.query.staking.ledger.multi(addresses);

      const stashes = getStashes(addresses, allBonded, allLedger);

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
    if (apiPromise && extension) {
      apiPromise.setSigner(extension?.signer);
    }
  }

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    getStashInfo();
    setSigner();
  }, [allAccounts, apiPromise, isApiReady]);

  useEffect(() => {
    getDerivedStaking();
    getDerivedBalances();
  }, [allStashes, apiPromise, isApiReady]);

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
