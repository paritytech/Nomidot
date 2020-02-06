// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApolloProvider } from '@apollo/react-hooks';
import { AccountsContextProvider } from '@substrate/context';
import ApolloClient, { gql } from 'apollo-boost';
import React from 'react';

import { Layout, Seo } from '../components';
import { APP_SLUG } from '../util';

const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'production' ? 'https://34.76.106.193:4000' : 'http://localhost:4001', // use port forwarding in dev, use external ip in prod
});

// client
//   .query({
//     query: gql`
//       {
//         blockNumbers(first: 10) {
//           number
//           authoredBy
//           hash
//           startDateTime
//         }
//       }
//     `
//   })
//   .then(result => console.log(result));

function IndexPage(): React.ReactElement {
  return (
    <ApolloProvider client={client}>
      <AccountsContextProvider originName={APP_SLUG}>
        <Layout>
          <Seo title='Home' />
        </Layout>
      </AccountsContextProvider>
    </ApolloProvider>
  );
}

export default IndexPage;
