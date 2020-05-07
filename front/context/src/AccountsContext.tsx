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
  Dispatch,
  ReducerAction,
  ReducerState,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { ApiRxContext, SystemContext } from './index';
import { getControllers, getStashes, IS_SSR } from './util';

const l = logger('accounts-context');

export type AccountBalanceMap = Record<string, DeriveBalancesAll>;
export type StashControllerMap = Record<string, DeriveStakingQuery>;
type Subscriptions = Subscription[];

interface State {
  accountBalanceMap: AccountBalanceMap;
  allAccounts: InjectedAccountWithMeta[];
  allBonded: Option<AccountId>[];
  allControllers: InjectedAccountWithMeta[];
  allLedger: Option<StakingLedger>[];
  allStashes: string[];
  currentAccount?: string;
  currentAccountNonce?: AccountInfo;
  readonly extension?: InjectedExtension;
  extensionNotFound: boolean;
  isExtensionReady: boolean;
  loadingAccountStaking: boolean;
  loadingBalances: boolean;
  stashControllerMap: StashControllerMap;
}

const INITIAL_STATE: State = {
  accountBalanceMap: {} as AccountBalanceMap,
  allAccounts: [] as InjectedAccountWithMeta[],
  allBonded: [] as Option<AccountId>[],
  allControllers: [] as InjectedAccountWithMeta[],
  allLedger: [] as Option<StakingLedger>[],
  allStashes: [] as string[],
  currentAccount: undefined,
  currentAccountNonce: undefined,
  extension: undefined,
  extensionNotFound: false,
  isExtensionReady: false,
  loadingAccountStaking: true,
  loadingBalances: true,
  stashControllerMap: {} as StashControllerMap,
};

enum ActionTypes {
  'setAccountBalanceMap',
  'setAllAccounts',
  'setAllBonded',
  'setAllControllers',
  'setAllLedger',
  'setAllStashes',
  'setCurrentAccount',
  'setCurrentAccountNonce',
  'setExtension',
  'setExtensionNotFound',
  'setIsExtensionReady',
  'setLoadingAccountStaking',
  'setLoadingBalances',
  'setStashControllerMap',
}

/**
 * See: https://stackoverflow.com/questions/49285864/is-there-a-valueof-similar-to-keyof-in-typescript
 **/
type ValueOf<T> = T[keyof T];

interface Action {
  type: keyof typeof ActionTypes;
  data: ValueOf<State>; // FIXME: this works but is not very precise, which is why we need the ... as `{type}` on all the action.data in stateReducer
}

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setAccountBalanceMap':
      return { ...state, accountBalanceMap: action.data as AccountBalanceMap };
    case 'setAllAccounts':
      return {
        ...state,
        allAccounts: action.data as InjectedAccountWithMeta[],
      };
    case 'setAllBonded':
      return { ...state, allBonded: action.data as Option<AccountId>[] };
    case 'setAllControllers':
      return {
        ...state,
        allControllers: action.data as InjectedAccountWithMeta[],
      };
    case 'setAllLedger':
      return { ...state, allLedger: action.data as Option<StakingLedger>[] };
    case 'setAllStashes':
      return { ...state, allStashes: action.data as string[] };
    case 'setCurrentAccount':
      return { ...state, currentAccount: action.data as string };
    case 'setCurrentAccountNonce':
      return { ...state, currentAccountNonce: action.data as AccountInfo };
    case 'setExtension':
      return { ...state, extension: action.data as InjectedExtension };
    case 'setExtensionNotFound':
      return { ...state, extensionNotFound: action.data as boolean };
    case 'setIsExtensionReady':
      return { ...state, isExtensionReady: action.data as boolean };
    case 'setLoadingAccountStaking':
      return { ...state, loadingAccountStaking: action.data as boolean };
    case 'setLoadingBalances':
      return { ...state, loadingBalances: action.data as boolean };
    case 'setStashControllerMap':
      return {
        ...state,
        stashControllerMap: action.data as StashControllerMap,
      };
    default:
      return state;
  }
};

interface AccountsContext {
  state: ReducerState<typeof stateReducer>;
  dispatch: Dispatch<ReducerAction<typeof stateReducer>>;
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

  // context
  const { api, isApiReady } = useContext(ApiRxContext);
  const { chain } = useContext(SystemContext);

  // state
  const [state, dispatch] = useReducer(stateReducer, INITIAL_STATE);

  const getDerivedBalances = useCallback((): Subscriptions | undefined => {
    if (state.allAccounts) {
      dispatch({
        type: 'setLoadingBalances',
        data: true,
      });
      const addresses = state.allAccounts.map(
        (account: InjectedAccountWithMeta) => account.address
      );

      const result: AccountBalanceMap = {};

      // n.b. cannot do multi on derives...
      const subs = addresses.map((address: string) => {
        const sub = api.derive.balances
          .all(address)
          .pipe(take(1))
          .subscribe((derivedBalances: DeriveBalancesAll) => {
            result[address] = derivedBalances;
          });

        return sub;
      });

      dispatch({
        type: 'setAccountBalanceMap',
        data: result,
      });

      console.log('abm -> ', result);

      writeStorage('derivedBalances', JSON.stringify(result));
      dispatch({
        type: 'setLoadingBalances',
        data: false,
      });
      return subs;
    }
  }, [state.allAccounts]);

  const getDerivedStaking = useCallback((): Subscriptions | undefined => {
    if (state.allStashes) {
      const result: StashControllerMap = {};

      const subs = state.allStashes.map((stashId: string) => {
        const sub = api.derive.staking
          .query(stashId)
          .pipe(take(1))
          .subscribe((stakingInfo: DeriveStakingQuery) => {
            result[stashId] = stakingInfo;
          });

        return sub;
      });

      dispatch({
        type: 'setStashControllerMap',
        data: result,
      });
      writeStorage('derivedStaking', JSON.stringify(result));
      return subs;
    }
  }, [api, state.allStashes]);

  const getStashInfo = useCallback((): Subscriptions | undefined => {
    if (isApiReady && api && state.allAccounts) {
      dispatch({
        type: 'setLoadingAccountStaking',
        data: true,
      });
      const addresses = state.allAccounts.map(
        (account: InjectedAccountWithMeta) => account.address
      );

      const bondSub = api.query.staking?.bonded
        .multi<Option<AccountId>>(addresses)
        .pipe(take(1))
        .subscribe((result: Option<AccountId>[]) => {
          dispatch({
            type: 'setAllBonded',
            data: result,
          });
        });

      const ledgerSub = api.query.staking.ledger
        .multi<Option<StakingLedger>>(addresses)
        .pipe(take(1))
        .subscribe((result: Option<StakingLedger>[]) => {
          dispatch({
            type: 'setAllLedger',
            data: result,
          });
        });

      return [bondSub, ledgerSub];
    }
  }, [api, isApiReady, state.allAccounts]);

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
        dispatch({
          type: 'setExtensionNotFound',
          data: true,
        });
        return;
      }

      if (IS_SSR) {
        throw new Error('Window does not exist during SSR');
      }

      dispatch({
        type: 'setExtension',
        data: extensions[0], // accounts, signer
      });

      const _web3Accounts = await web3Accounts();

      _web3Accounts.map((account: InjectedAccountWithMeta) => {
        account.address = encodeAddress(decodeAddress(account.address), 2);
      });

      dispatch({
        type: 'setAllAccounts',
        data: _web3Accounts,
      });
      l.log(`Accounts ready, encoded to ss58 prefix of ${chain}`);
      dispatch({
        type: 'setIsExtensionReady',
        data: true,
      });
    }
  }, [chain, originName]);

  const fetchCachedRpcResults = useCallback((): void => {
    const cachedStashes = localStorage.getItem('allStashes');
    const cachedControllers = localStorage.getItem('allControllers');
    const cachedBalances = localStorage.getItem('derivedBalances');
    const cachedStaking = localStorage.getItem('derivedStaking');

    if (cachedStashes) {
      const asStashArray = JSON.parse(cachedStashes) as string[];
      dispatch({
        type: 'setAllStashes',
        data: asStashArray,
      });
    }

    if (cachedControllers) {
      const asControllerArray = JSON.parse(
        cachedControllers
      ) as InjectedAccountWithMeta[];

      dispatch({
        type: 'setAllControllers',
        data: asControllerArray,
      });
    }

    if (cachedBalances) {
      dispatch({
        type: 'setAccountBalanceMap',
        data: JSON.parse(cachedBalances) as AccountBalanceMap,
      });
    }

    if (cachedStaking) {
      dispatch({
        type: 'setStashControllerMap',
        data: JSON.parse(cachedStaking) as StashControllerMap,
      });
    }
  }, []);

  // const fetchCachedUserSession = useCallback((): void => {
  //   const cachedAccount = localStorage.getItem('currentAccount');

  //   if (cachedAccount !== null) {
  //     dispatch({
  //       type: 'setCurrentAccount',
  //       data: JSON.parse(cachedAccount),
  //     });
  //   }
  // }, []);

  // set signer
  useEffect(() => {
    if (api && state.extension && state.isExtensionReady) {
      api.setSigner(state.extension.signer);
    }
  }, [api, state.extension, state.isExtensionReady]);

  // set controllers from accounts in injected extension
  useEffect(() => {
    if (state.extension && state.isExtensionReady) {
      const controllers: InjectedAccountWithMeta[] = getControllers(
        state.allAccounts,
        state.stashControllerMap
      );

      writeStorage('allControllers', JSON.stringify(controllers));
      dispatch({
        type: 'setAllControllers',
        data: controllers,
      });
    }
  }, [state.allAccounts, state.extension, state.stashControllerMap]);

  // set stashes from accounts in injected extension
  useEffect(() => {
    if (
      state.allBonded &&
      state.allLedger &&
      state.extension &&
      state.isExtensionReady
    ) {
      const addresses = state.allAccounts.map(
        (account: InjectedAccountWithMeta) => account.address
      );

      const stashes: string[] = getStashes(
        addresses,
        state.allBonded,
        state.allLedger
      );

      writeStorage('allStashes', JSON.stringify(stashes));

      dispatch({
        type: 'setAllStashes',
        data: stashes,
      });
      dispatch({
        type: 'setLoadingAccountStaking',
        data: false,
      });
    }
  }, [
    state.allAccounts,
    state.allBonded,
    state.allLedger,
    state.extension,
    state.isExtensionReady,
  ]);

  useEffect(() => {
    fetchAccounts();
    fetchCachedRpcResults();
  }, [typeof window, fetchAccounts, fetchCachedRpcResults]);

  useEffect(() => {
    if ((state.extension, state.isExtensionReady)) {
      const allSubs = getStashInfo();

      if (allSubs) {
        return (): void =>
          allSubs.forEach(sub => {
            sub.unsubscribe();
          });
      }
    }
  }, [
    api,
    getStashInfo,
    isApiReady,
    state.allAccounts,
    state.extension,
    state.isExtensionReady,
  ]);

  useEffect(() => {
    if (api && isApiReady && state.extension) {
      const stakingSubHandlers = getDerivedStaking();
      const balanceSubHandlers = getDerivedBalances();

      const allSubs = [...balanceSubHandlers, ...stakingSubHandlers];

      if (allSubs) {
        return (): void =>
          allSubs.forEach(sub => {
            sub.unsubscribe();
          });
      }
    }
  }, [
    api,
    isApiReady,
    getDerivedBalances,
    getDerivedStaking,
    state.allStashes,
    state.isExtensionReady,
  ]);

  // set current account nonce
  useEffect(() => {
    if (state.extension) {
      const getAccountNonce = (): Subscription | undefined => {
        if (api && isApiReady) {
          const sub = api.query.system
            .account<AccountInfo>(state.currentAccount)
            .pipe(take(1))
            .subscribe((nonce: AccountInfo) => {
              dispatch({
                type: 'setCurrentAccountNonce',
                data: nonce,
              });
            });

          return sub;
        }
      };

      const sub = getAccountNonce();

      return (): void => sub?.unsubscribe();
    }
  }, [
    api,
    isApiReady,
    state.allAccounts,
    state.currentAccount,
    state.extension,
  ]);

  // set default account
  useEffect(() => {
    if (state.allAccounts.length && !state.currentAccount) {
      dispatch({
        type: 'setCurrentAccount',
        data: state.allAccounts[0].address,
      });
      writeStorage(
        'currentAccount',
        JSON.stringify(state.allAccounts[0].address)
      );
    }
  }, [state.allAccounts, state.currentAccount, state.isExtensionReady]);

  return (
    <AccountsContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}
