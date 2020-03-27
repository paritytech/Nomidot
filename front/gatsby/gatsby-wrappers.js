// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApolloProvider } from '@apollo/react-hooks';
import { WsProvider } from '@polkadot/api';
import { global } from '@substrate/design-system';
import React from 'react';

import { AccountsContextProvider } from '../context/src/AccountsContext';
import { ApiContextProvider } from '../context/src/ApiContext';
import {
  SystemContext,
  SystemContextProvider,
} from '../context/src/SystemContext';
import {
  TxQueueContextProvider
} from '../context/src/TxQueueContext';
import client from './src/apollo';
import { Layout, Seo } from './src/components';
import { APP_SLUG } from './src/util';

const { GlobalStyle } = global;
const WS_PROVIDER = new WsProvider('wss://cc3-5.kusama.network/');

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <ApiContextProvider provider={WS_PROVIDER}>
      <SystemContextProvider provider={WS_PROVIDER}>
        <SystemContext.Consumer>
          {isSystemReady => {
            return (
              isSystemReady && (
                <TxQueueContextProvider>
                  <AccountsContextProvider originName={APP_SLUG}>
                    {element}
                  </AccountsContextProvider>
                </TxQueueContextProvider>
              )
            );
          }}
        </SystemContext.Consumer>
      </SystemContextProvider>
    </ApiContextProvider>
  </ApolloProvider>
);

export const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>
    <Seo title='Polkadot/Kusama Staking Portal' />
    <GlobalStyle />
    {element}
  </Layout>
);
