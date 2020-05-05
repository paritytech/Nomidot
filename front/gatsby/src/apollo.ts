// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import * as ws from 'ws';
// <service-name>.<namespace>:port
const httpLink = new HttpLink({
  uri: `${
    process.env.NODE_ENV === 'production'
      ? 'http://nomidot-server.nomidot-staging:4000'
      : 'https://test.nodewatcher-server.polkassembly.io/'
  }`,
});

const wsLink = new WebSocketLink({
  uri: `${
    process.env.NODE_ENV === 'production'
      ? 'ws://nomidot-server.nomidot-staging:4000'
      : 'wss://test.nodewatcher-server.polkassembly.io/'
  }`,
  options: {
    reconnect: true,
  },
  webSocketImpl: typeof window === 'undefined' ? ws : window.WebSocket, // ws does not work in the browser. Browser clients must use the native WebSocket object. But during production SSR, we must use ws.
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
