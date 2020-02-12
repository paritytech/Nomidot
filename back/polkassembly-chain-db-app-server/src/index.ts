// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as dotenv from 'dotenv';
import { GraphQLServer } from 'graphql-yoga';

import { prisma } from './generated/prisma-client';
import { Query } from './resolvers/query';
import { Subscription } from './resolvers/subscription';

dotenv.config();

const port = process.env.PORT || 4010;

const resolvers = {
  Subscription,
  Query,
};

const server = new GraphQLServer({
  context: { prisma },
  typeDefs: './src/schema.graphql',
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
});

const options = {
  port,
};

server.start(options, ({ port }) =>
  console.log(
    `Polkassembly chain-db app server running on http://localhost:${port}`
  )
);
