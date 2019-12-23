import { GraphQLServer } from 'graphql-yoga';

import datamodel from '@substrate/node-watcher/';

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