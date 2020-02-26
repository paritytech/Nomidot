// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApolloProvider } from '@apollo/react-hooks';
import { WsProvider } from '@polkadot/api';
import { global } from '@substrate/design-system';
import React from 'react';

import { AccountsContextProvider } from '../context/src/AccountsContext';
import { ApiContextProvider } from '../context/src/ApiContext';
import { SystemContextProvider } from '../context/src/SystemContext';
import client from './src/apollo';
import { Layout, Seo } from './src/components';
import { APP_SLUG } from './src/util';

const { GlobalStyle } = global;

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <ApiContextProvider
      provider={new WsProvider('wss://cc3-5.kusama.network/')}
    >
      <SystemContextProvider>
        <AccountsContextProvider originName={APP_SLUG}>
          {element}
        </AccountsContextProvider>
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
