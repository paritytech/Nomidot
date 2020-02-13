// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GraphQLServer } from 'graphql-yoga';

import { prisma } from './generated/prisma-client';
import { Query } from './resolvers/query';
import { Subscription } from './resolvers/subscription';

const resolvers = {
  Subscription,
  Query,
  BlockNumber: {
    authoredBy(parent: any) {
      return prisma.blockNumber({ id: parent.id }).authoredBy();
    },
    hash(parent: any) {
      return prisma.blockNumber({ id: parent.id }).hash();
    },
    id(parent: any) {
      return prisma.blockNumber({ id: parent.id }).id();
    },
    number(parent: any) {
      return prisma.blockNumber({ id: parent.id }).number();
    },
    startDateTime(parent: any) {
      return prisma.blockNumber({ id: parent.id }).startDateTime();
    },
  },
  Era: {
    eraStartSessionIndex(parent: any) {
      return prisma.era({ id: parent.id }).eraStartSessionIndex();
    },
  },
  HeartBeat: {
    sessionIndex(parent: any) {
      return prisma.heartBeat({ id: parent.id }).sessionIndex();
    },
  },
  Nomination: {
    session(parent: any) {
      return prisma.nomination({ id: parent.id }).session();
    },
  },
  OfflineValidator: {
    sessionIndex(parent: any) {
      return prisma.offlineValidator({ id: parent.id }).sessionIndex();
    },
  },
  Reward: {
    authoredBlock(parent: any) {
      return prisma.reward({ id: parent.id }).authoredBlock();
    },
    sessionIndex(parent: any) {
      return prisma.reward({ id: parent.id }).sessionIndex();
    },
  },
  Session: {
    id(parent: any) {
      return prisma.session({ id: parent.id }).id();
    },
    index(parent: any) {
      return prisma.session({ id: parent.id }).index();
    },
    start(parent: any) {
      return prisma.session({ id: parent.id }).start();
    },
  },
  Stake: {
    blockNumber(parent: any) {
      return prisma.stake({ id: parent.id }).blockNumber();
    },
  },
  TotalIssuance: {
    blockNumber(parent: any) {
      return prisma.totalIssuance({ id: parent.id }).blockNumber();
    },
  },
  Validator: {
    session(parent: any) {
      return prisma.validator({ id: parent.id }).session();
    },
  },
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
});
server.start(() => console.log('Server is running on http://localhost:4000'));
