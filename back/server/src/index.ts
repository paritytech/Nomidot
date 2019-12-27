import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'
import { Context } from './utils'

const resolvers = {
  Query: {
    blockNumber(parent, { number }, context: Context) {
      return context.prisma.blockNumber({ number })
    },
    blockNumbers(parent, {}, context: Context) {
      return context.prisma.blockNumbers()
    }
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
