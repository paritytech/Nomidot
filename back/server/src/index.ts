// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GraphQLServer, PubSub } from 'graphql-yoga';

import { prisma, Prisma } from './generated/prisma-client';
import { Context } from './utils';

type Selectors = Record<string, any>;

const resolvers = {
  Subscription: {
    chainBestBlockNumber: {
      subscribe(parent: any, args, context: Context, info) {
        return context.prisma.$subscribe.blockNumber(
          {
            mutation_in: ['CREATED']
          }
        )
      }
    }
  },
  Query: {
    blockNumber(parent: any, { number }: Selectors, context: Context) {
      return context.prisma.blockNumber({ number });
    },
    blockNumberAtHash(parent: any, { hash }: Selectors, context: Context) {
      return context.prisma.blockNumber({ hash });
    },
    blockNumbersAuthoredBy(
      parent: any,
      { authoredBy }: Selectors,
      context: Context
    ) {
      return context.prisma.blockNumbers({ where: { authoredBy } });
    },
    eraAtIndex(parent: any, { index }: Selectors, context: Context) {
      return context.prisma.era({ index });
    },
    erasWhere(
      parent: any,
      { first, orderBy, skip }: Selectors,
      context: Context
    ) {
      return context.prisma.eras({ first, orderBy, skip });
    },
    nominationsWhere(parent: any, where: Selectors, context: Context) {
      return context.prisma.nominations({ where });
    },
    sessionAtIndex(parent: any, { index }: Selectors, context: Context) {
      return context.prisma.session({ index });
    },
    sessionsWhere(
      parent: any,
      { first, orderBy, skip }: Selectors,
      context: Context
    ) {
      return context.prisma.sessions({ first, orderBy, skip });
    },
    slashingsAtBlock(
      parent: any,
      { blockNumber }: Selectors,
      context: Context
    ) {
      return context.prisma.slashings({ where: { blockNumber } });
    },
    slashingsWhere(
      parent: any,
      { first, orderBy, skip }: Selectors,
      context: Context
    ) {
      return context.prisma.slashings({ first, orderBy, skip });
    },
    slashingsAtBlockWhere(
      parent: any,
      { blockNumber, first, orderBy, skip }: Selectors,
      context: Context
    ) {
      return context.prisma.slashings({
        where: { blockNumber },
        first,
        orderBy,
        skip,
      });
    },
    validatorsAtSession(parent: any, { session }: Selectors, context: Context) {
      return context.prisma.validators({ where: { session } });
    },
    validatorsWhere(
      parent: any,
      { first, orderBy, skip }: Selectors,
      context: Context
    ) {
      return context.prisma.validators({ first, orderBy, skip });
    },
    validatorsAtSessionWhere(
      parent: any,
      { session, first, orderBy, skip }: Selectors,
      context: Context
    ) {
      return context.prisma.validators({
        where: { session },
        first,
        orderBy,
        skip,
      });
    },
  },
  Mutation: {
    writeBlockNumber(parent, { hash, number }, context, info) {
      return context.prisma.createBlockNumber({
        number,
        authoredBy: 'YJKIM',
        startDateTime: new Date(Date.now()).toISOString(),
        hash,
      },
      info);
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma }
});
server.start(() => console.log('Server is running on http://localhost:4000'));
