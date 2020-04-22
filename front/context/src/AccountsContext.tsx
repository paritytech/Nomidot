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
  useReducer,
  ReducerState,
  ReducerAction,
  Dispatch
} from 'react';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { ApiRxContext, SystemContext } from './index';
import { getControllers, getStashes, IS_SSR } from './util';

const l = logger('accounts-context');

type AccountBalanceMap = Record<string, DeriveBalancesAll>;
type StashControllerMap = Record<string, DeriveStakingQuery>;
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
  isExtensionReady: false,
  loadingAccountStaking: true,
  loadingBalances: true,
  stashControllerMap: {} as StashControllerMap
};

const stateReducer = (state: State, action: any) => {
  switch (action.type) {
    case 'setAccountBalanceMap':
      return { ...state, accountBalanceMap: action.accountBalanceMap }
    case 'setAllAccounts':
      return { ...state, allAccounts: action.allAccounts }
    case 'setAllControllers':
      return { ...state, allControllers: action.allControllers }
    case 'setAllStashes':
      return { ...state, allStashes: action.allStashes }
    case 'setCurrentAccount':
      return { ...state, currentAccount: action.currentAccount }
    case 'setCurrentAccountNonce':
      return { ...state, currentAccountNonce: action.currentAccountNonce }
    case 'setExtension':
      return { ...state, extension: action.extension }
    case 'setIsExtensionReady':
      return { ...state, isExtensionReady: action.isExtensionReady }
    case 'setLoadingAccountStaking':
      return { ...state, loadingAccountStaking: action.loadingAccountStaking }
    case 'setLoadingBalances':
      return { ...state, loadingBalances: action.loadingBalances }
    case 'setStashControllerMap':
      return { ...state, stashControllerMap: action.stashControllerMap }
    default:
      return state;
  }
}

interface AccountsContext {
  state: ReducerState<typeof stateReducer>,
  dispatch: Dispatch<ReducerAction<typeof stateReducer>>
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

  const getAccountNonce = (): Subscription | undefined => {
    if (api && isApiReady) {
      const sub = api.query.system
        .account<AccountInfo>(state.currentAccount)
        .pipe(take(1))
        .subscribe((nonce: AccountInfo) => {
          dispatch({
            type: 'setCurrentAccountNonce',
            currentAccountNonce: nonce
          });
        });

      return sub;
    }
  };

  const getDerivedBalances = (): Subscriptions | undefined => {
    if (state.allAccounts) {
      dispatch({
        type: 'setLoadingBalances',
        loadingBalance: true
      });
      const addresses = state.allAccounts.map((account: InjectedAccountWithMeta) => account.address);

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

      dispatch({
        type: 'setAccountBalanceMap',
        accountBalanceMap: result
      });
      writeStorage('derivedBalances', JSON.stringify(result));
      dispatch({
        type: 'setLoadingBalances',
        loadingBalance: false
      });
      return subs;
    }
  };

  const getDerivedStaking = (): Subscriptions | undefined => {
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
        stashControllerMap: result
      });
      writeStorage('derivedStaking', JSON.stringify(result));
      return subs;
    }
  };

  const getStashInfo = (): Subscriptions | undefined => {
    if (isApiReady && api && state.allAccounts) {
      dispatch({
        type: 'setLoadingAccountStaking',
        loadingAccountStaking: true
      });
      const addresses = state.allAccounts.map((account: InjectedAccountWithMeta) => account.address);

      const bondSub = api.query.staking?.bonded
        .multi<Option<AccountId>>(addresses)
        .pipe(take(1))
        .subscribe((result: Option<AccountId>[]) => {
          dispatch({
            type: 'setAllBonded',
            allBonded: result
          });
        });

      const ledgerSub = api.query.staking.ledger
        .multi<Option<StakingLedger>>(addresses)
        .pipe(take(1))
        .subscribe((result: Option<StakingLedger>[]) => {
          dispatch({
            type: 'setAllLedger',
            allLedger: result
          });
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

      dispatch({
        type: 'setExtension',
        extension: extensions[0] // accounts, signer
      })

      const _web3Accounts = await web3Accounts();

      _web3Accounts.map((account: InjectedAccountWithMeta) => {
        account.address = encodeAddress(decodeAddress(account.address), 2);
      });

      dispatch({
        type: 'setAccounts',
        allAccounts: _web3Accounts
      });
      l.log(`Accounts ready, encoded to ss58 prefix of ${chain}`);
      dispatch({
        type: 'setIsExtensionReady',
        isExtensionReady: true
      });
    }
  }, [chain, originName]);

  const setDefaultAccount = () => {
    if (state.allAccounts.length && !state.currentAccount) {
      dispatch({
        type: 'setCurrentAccount',
        currentAccount: state.allAccounts[0].address
      });
      writeStorage('currentAccount', state.allAccounts[0].address);
    }
  };

  const setSigner = () => {
    if (api && state.extension && state.isExtensionReady) {
      api.setSigner(state.extension.signer);
    }
  };

  const fetchCachedUserSession = () => {
    const cachedCurrentAccount = localStorage.getItem('currentAccount');

    if (cachedCurrentAccount) {
      dispatch({
        type: 'setCurrentAccount',
        currentAccount: JSON.parse(cachedCurrentAccount) as string
      })
    }
  };

  const fetchCachedRpcResults = () => {
    const cachedStashes = localStorage.getItem('allStashes');
    const cachedControllers = localStorage.getItem('allControllers');
    const cachedBalances = localStorage.getItem('derivedBalances');
    const cachedStaking = localStorage.getItem('derivedStaking');

    if (cachedStashes) {
      const asStashArray = JSON.parse(cachedStashes) as string[];
      dispatch({
        type: 'setAllStashes',
        allStashes: asStashArray
      })
    }

    if (cachedControllers) {
      const asControllerArray = JSON.parse(
        cachedControllers
      ) as InjectedAccountWithMeta[];

      dispatch({
        type: 'setAllControllers',
        allControllers: asControllerArray
      });
    }

    if (cachedBalances) {
      dispatch({
        type: 'setAccountBalanceMap',
        accountBalanceMap: JSON.parse(cachedBalances) as AccountBalanceMap
      })
    }

    if (cachedStaking) {
      dispatch({
        type: 'setStashControllerMap',
        stashControllerMap: JSON.parse(cachedStaking) as StashControllerMap
      });
    }
  };

  useEffect(() => {
    setSigner();
  }, [state.isExtensionReady]);

  useEffect(() => {
    const controllers: InjectedAccountWithMeta[] = getControllers(
      state.allAccounts,
      state.stashControllerMap
    );

    writeStorage('allControllers', JSON.stringify(controllers));
    dispatch({
      type: 'setAllControllers',
      allControllers: controllers
    });
  }, [state.stashControllerMap]);

  useEffect(() => {
    if (state.allBonded && state.allLedger) {
      const addresses = state.allAccounts.map((account: InjectedAccountWithMeta) => account.address);

      const stashes: string[] = getStashes(addresses, state.allBonded, state.allLedger);

      writeStorage('allStashes', JSON.stringify(stashes));

      dispatch({
        type: 'setAllStashes',
        allStashes: stashes
      });
      dispatch({
        type: 'setLoadingAccountStaking',
        loadingAccountStaking: false
      });
    }
  }, [state.allBonded, state.allLedger]);

  useEffect(() => {
    fetchCachedUserSession();
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
  }, [state.allAccounts, api, isApiReady]);

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
  }, [state.allStashes, api, isApiReady]);

  useEffect(() => {
    writeStorage('currentAccount', JSON.stringify(state.currentAccount));

    const sub = getAccountNonce();

    return () => sub?.unsubscribe();
  }, [state.currentAccount]);

  useEffect(() => {
    setDefaultAccount();
  }, [state.allAccounts, state.isExtensionReady]);

  return (
    <AccountsContext.Provider
      value={{
        state,
        dispatch
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
}

// if (!extension) {
//   throw new Error(
//     'Please use `extension` only after `isExtensionReady` is set to true'
//   );
// }

// if (IS_SSR) {
//   throw new Error('Window does not exist during SSR');
// }

// return extension;
// },


// const [allAccounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  // const [allBonded, setAllBonded] = useState<Option<AccountId>[]>();
  // const [allLedger, setAllLedger] = useState<Option<StakingLedger>[]>();

  // const [accountBalanceMap, setAccountBalanceMap] = useState<AccountBalanceMap>(
  //   {}
  // );
  // const [allControllers, setAllControllers] = useState<
  //   InjectedAccountWithMeta[]
  // >([]);
  // const [allStashes, setAllStashes] = useState<string[]>([]);
  // const [stashControllerMap, setStashControllerMap] = useState<
  //   StashControllerMap
  // >({});
  // const [currentAccount, setCurrentAccount] = useState<string>();
  // const [currentAccountNonce, setCurrentAccountNonce] = useState<AccountInfo>();
  // const [extension, setExtension] = useState<InjectedExtension>();
  // const [loadingBalances, setLoadingBalances] = useState(true);
  // const [loadingAccountStaking, setLoadingAccountStaking] = useState(true);
  // const [isExtensionReady, setIsExtensionReady] = useState(false);