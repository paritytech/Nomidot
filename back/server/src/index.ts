// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
  type Query {
    blockNumber(number: Int): Int!
  }
`

const resolvers = {
  Query: {
    blockNumber: (_: any, { number }: any) => `Block #: ${number}`,
  },
}

const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))