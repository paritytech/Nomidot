// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApolloProvider } from '@apollo/react-hooks';
import { AccountsContextProvider } from '@substrate/context';
import React from 'react';

import { Layout, Seo } from '../components';
import { APP_SLUG } from '../util';

function IndexPage(): React.ReactElement {
  return (
    <AccountsContextProvider originName={APP_SLUG}>
      <Layout>
        <Seo title='Home' />
      </Layout>
    </AccountsContextProvider>
  );
}

export default IndexPage;
