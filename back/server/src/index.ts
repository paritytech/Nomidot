// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GraphQLServer } from 'graphql-yoga';

import { prisma } from './generated/prisma-client';
import { Query } from './resolvers/query';
import { Subscription } from './resolvers/subscription';

const resolvers = {
  Subscription,
  Query
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma }
});
server.start(() => console.log('Server is running on http://localhost:4000'));
