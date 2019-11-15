// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRx, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable, isWeb3Injected } from '@polkadot/extension-dapp';
import { createType, bool } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import { logger } from '@polkadot/util';
import React, { useState, useEffect } from 'react';
import { combineLatest } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { AlertsContextProvider } from './AlertsContext';
import { AppContext, System } from './AppContext';
import { StakingContextProvider } from './StakingContext';
import { TxQueueContextProvider } from './TxQueueContext';
import { InjectedAccountExt } from './types';
import { isTestChain } from './util';

interface State {
  injectedAccounts: InjectedAccountExt[];
  isWaitingInjected: boolean;
  isWeb3Injected: boolean;
  isReady: boolean;
  system: System;
}

const INIT_ERROR = new Error('Please wait for `isReady` before fetching this property');

const DISCONNECTED_STATE_PROPERTIES = {
  injectedAccounts: [],
  isWeb3Injected: false,
  isReady: false,
  isWaitingInjected: true,
  system: {
    get chain (): never {
      throw INIT_ERROR;
    },
    get health (): never {
      throw INIT_ERROR;
    },
    get name (): never {
      throw INIT_ERROR;
    },
    get properties (): never {
      throw INIT_ERROR;
    },
    get version (): never {
      throw INIT_ERROR;
    }
  }
};

// Hardcode default to Kusama
const WS_URL = 'wss://kusama-rpc.polkadot.io/';

// Most chains (including Kusama) put the ss58 prefix in the chain properties.
// Just in case, we default to 42
const SS58_PREFIX = 42;

let keyringInitialized = false;

const l = logger('context');

const api = new ApiRx({ provider: new WsProvider(WS_URL) });
const injectedPromise = web3Enable('nomidot'); // FIXME change when name is finalized

export function ContextGate (props: { children: React.ReactNode }): React.ReactElement {
  const { children } = props;
  const [state, setState] = useState<State>(DISCONNECTED_STATE_PROPERTIES);
  const { injectedAccounts, isWeb3Injected, isReady, system } = state;

  const getInjected = async () => {
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

    setState({
      ...state,
      isWeb3Injected,
      injectedAccounts
    })
  }

  useEffect(() => {
    injectedPromise
      .then((): void => setState({
        ...state,
        isWaitingInjected: false
      }))
      .catch((error: Error) => console.error(error));

    // Block the UI when disconnected
    api.isConnected.pipe(
      filter(isConnected => !isConnected)
    ).subscribe(() => {
      setState(DISCONNECTED_STATE_PROPERTIES);
    });

    // We want to fetch all the information again each time we reconnect. We
    // might be connecting to a different node, or the node might have changed
    // settings.
    api.isConnected
      .pipe(
        filter(isConnected => !!isConnected),
        // API needs to be ready to be able to use RPCs; connected isn't enough
        switchMap(() =>
          api.isReady
        ),
        switchMap(() =>
          combineLatest([
            api.rpc.system.chain(),
            api.rpc.system.health(),
            api.rpc.system.name(),
            api.rpc.system.properties(),
            api.rpc.system.version()
          ])
        )
      )
      .subscribe(([chain, health, name, properties, version]) => {
        getInjected();

        if (!keyringInitialized) {
          // keyring with Schnorrkel support
          keyring.loadAll({
            ss58Format: properties.ss58Format.unwrapOr(createType('u8', SS58_PREFIX)).toNumber(),
            genesisHash: api.genesisHash,
            isDevelopment: isTestChain(chain.toString()),
            type: 'ed25519'
          });
          keyringInitialized = true;
        } else {
          // The keyring can only be initialized once. To make sure that the
          // keyring values are up-to-date in case the node has changed settings
          // we need to reinitialize it.
          window.location.reload();
          return;
        }

        l.log(`Api connected to ${WS_URL}`);
        l.log(`Api ready, connected to chain "${chain}" with properties ${JSON.stringify(properties)}`);

        setState({
          ...state,
          isReady: true,
          system: {
            chain: chain.toString(),
            health,
            name: name.toString(),
            properties,
            version: version.toString()
          }
        });
      });
  }, []);

  return (
    <AlertsContextProvider>
      <TxQueueContextProvider>
        <AppContext.Provider value={{
          api: api,
          injectedAccounts,
          isReady,
          keyring,
          system
        }}>
          <StakingContextProvider>
            {children}
          </StakingContextProvider>
        </AppContext.Provider>
      </TxQueueContextProvider>
    </AlertsContextProvider>
  );
}
