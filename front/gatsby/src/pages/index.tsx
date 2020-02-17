// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApolloProvider } from '@apollo/react-hooks';
import { WsProvider } from '@polkadot/api';
import { AccountsContextProvider, ApiContextProvider } from '@substrate/context';
import React from 'react';

import client from '../apollo';
import { Layout, Seo } from '../components';
import { APP_SLUG } from '../util';

function IndexPage(): React.ReactElement {
  return (
    <ApolloProvider client={client}>
      <ApiContextProvider provider={new WsProvider('wss://cc3-5.kusama.network/')}>
        <AccountsContextProvider originName={APP_SLUG}>
          <Layout>
            <Seo title='Home' />
          </Layout>
        </AccountsContextProvider>
      </ApiContextProvider>
    </ApolloProvider>
  );
}

export default IndexPage;
