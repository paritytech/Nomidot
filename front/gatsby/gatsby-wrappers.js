// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApolloProvider } from '@apollo/react-hooks';
import { WsProvider } from '@polkadot/api';
import {
  AccountsContextProvider,
  ApiRxContextProvider,
  SystemContext,
  SystemContextProvider,
  TxQueueContextProvider,
} from '@substrate/context';
import { GlobalStyle, polkadotOfficialTheme } from '@substrate/ui-components';
import React from 'react';
import { ThemeProvider } from 'styled-components';

import client from './src/apollo';
import { Layout, Seo, Status } from './src/components';
import { APP_SLUG } from './src/util';

const WS_PROVIDER = new WsProvider('wss://kusama-rpc.polkadot.io/');

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <ApiRxContextProvider provider={WS_PROVIDER}>
      <SystemContextProvider provider={WS_PROVIDER}>
        <SystemContext.Consumer>
          {isSystemReady => {
            return (
              isSystemReady && (
                <AccountsContextProvider originName={APP_SLUG}>
                  <TxQueueContextProvider>{element}</TxQueueContextProvider>
                </AccountsContextProvider>
              )
            );
          }}
        </SystemContext.Consumer>
      </SystemContextProvider>
    </ApiRxContextProvider>
  </ApolloProvider>
);

export const wrapPageElement = ({ element, props }) => (
  <ThemeProvider theme={polkadotOfficialTheme}>
    <Layout {...props}>
      <Seo title='Polkadot/Kusama Staking Portal' />
      <GlobalStyle />
      <Status />
      {element}
    </Layout>
  </ThemeProvider>
);
