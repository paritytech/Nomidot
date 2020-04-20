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
import {
  AccountId,
  AccountInfo,
  StakingLedger,
} from '@polkadot/types/interfaces';
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
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { ApiRxContext, SystemContext } from './index';
import { getStashes, IS_SSR } from './util';

type AccountBalanceMap = Record<string, DeriveBalancesAll>;
type StashControllerMap = Record<string, DeriveStakingQuery>;
type Subscriptions = Subscription[];

interface AccountsContext {
  accountBalanceMap: AccountBalanceMap;
  allAccounts: InjectedAccountWithMeta[];
  // allControllers: StakingLedger[];
  allStashes: string[];
  currentAccount?: string;
  currentAccountNonce?: AccountInfo;
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
  const { api, isApiReady } = useContext(ApiRxContext);
  const { chain } = useContext(SystemContext);

  // state
  const [allAccounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [allBonded, setAllBonded] = useState<Option<AccountId>[]>();
  const [allLedger, setAllLedger] = useState<Option<StakingLedger>[]>();

  const [accountBalanceMap, setAccountBalanceMap] = useState<AccountBalanceMap>(
    {}
  );
  const [allStashes, setAllStashes] = useState<string[]>([]);
  const [stashControllerMap, setStashControllerMap] = useState<
    StashControllerMap
  >({});
  const [currentAccount, setCurrentAccount] = useState<string>();
  const [currentAccountNonce, setCurrentAccountNonce] = useState<AccountInfo>();
  const [extension, setExtension] = useState<InjectedExtension>();
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [loadingAccountStaking, setLoadingAccountStaking] = useState(true);
  const [isExtensionReady, setIsExtensionReady] = useState(false);

  const getAccountNonce = (): Subscription | undefined => {
    if (api && isApiReady) {
      const sub = api.query.system
        .account<AccountInfo>(currentAccount)
        .pipe(take(1))
        .subscribe((nonce: AccountInfo) => {
          setCurrentAccountNonce(nonce);
        });

      return sub;
    }
  };

  const getDerivedBalances = (): Subscriptions | undefined => {
    if (allAccounts) {
      setLoadingBalances(true);
      const addresses = allAccounts.map(account => account.address);

      const result: AccountBalanceMap = {};

      // Yuck, cannot do multi on derives...
      const subs = addresses.map((address: string) => {
        const sub = api.derive.balances
          .all(address)
          .pipe(take(1))
          .subscribe((derivedBalances: DeriveBalancesAll) => {
            result[address] = derivedBalances;
          });

        return sub;
      });

      setAccountBalanceMap(result);
      writeStorage('derivedBalances', JSON.stringify(result));
      setLoadingBalances(false);

      return subs;
    }
  };

  const getDerivedStaking = (): Subscriptions | undefined => {
    if (allStashes) {
      const result: StashControllerMap = {};

      const subs = allStashes.map(stashId => {
        const sub = api.derive.staking
          .query(stashId)
          .pipe(take(1))
          .subscribe((stakingInfo: DeriveStakingQuery) => {
            result[stashId] = stakingInfo;
          });

        return sub;
      });

      setStashControllerMap(result);
      writeStorage('derivedStaking', JSON.stringify(result));
      return subs;
    }
  };

  const getStashInfo = (): Subscriptions | undefined => {
    if (isApiReady && api && allAccounts) {
      setLoadingAccountStaking(true);
      const addresses = allAccounts.map(account => account.address);

      const bondSub = api.query.staking?.bonded
        .multi<Option<AccountId>>(addresses)
        .pipe(take(1))
        .subscribe((result: Option<AccountId>[]) => {
          setAllBonded(result);
        });

      const ledgerSub = api.query.staking.ledger
        .multi<Option<StakingLedger>>(addresses)
        .pipe(take(1))
        .subscribe((result: Option<StakingLedger>[]) => {
          setAllLedger(result);
        });

      return [bondSub, ledgerSub];
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
      l.log(`Accounts ready, encoded to ss58 prefix of ${chain}`);
      setIsExtensionReady(true);
    }
  }, [chain, originName]);

  const setDefaultAccount = () => {
    if (allAccounts.length) {
      setCurrentAccount(allAccounts[0].address);
    }
  };

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
    if (allBonded && allLedger) {
      const addresses = allAccounts.map(account => account.address);

      const stashes: string[] = getStashes(addresses, allBonded, allLedger);

      writeStorage('allStashes', JSON.stringify(stashes));

      setAllStashes(stashes);

      setLoadingAccountStaking(false);
    }
  }, [allBonded, allLedger]);

  useEffect(() => {
    fetchAccounts();
    fetchCachedRpcResults();
  }, []);

  useEffect(() => {
    const allSubs = getStashInfo();

    if (allSubs) {
      return () =>
        allSubs.forEach(sub => {
          sub.unsubscribe();
        });
    }
  }, [allAccounts, api, isApiReady]);

  useEffect(() => {
    if (api && isApiReady) {
      const stakingSubHandlers = getDerivedStaking();
      const balanceSubHandlers = getDerivedBalances();

      const allSubs = [...balanceSubHandlers, ...stakingSubHandlers];

      if (allSubs) {
        return () =>
          allSubs.forEach(sub => {
            sub.unsubscribe();
          });
      }
    }
  }, [allStashes, api, isApiReady]);

  useEffect(() => {
    const sub = getAccountNonce();

    return () => sub?.unsubscribe();
  }, [currentAccount]);

  useEffect(() => {
    setDefaultAccount();
  }, [allAccounts]);

  return (
    <AccountsContext.Provider
      value={{
        accountBalanceMap,
        allAccounts,
        // allControllers,
        allStashes,
        currentAccount,
        currentAccountNonce,
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
