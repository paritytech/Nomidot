import { GraphQLServer } from 'graphql-yoga'
import { prisma } from './generated/prisma-client'
import { Context } from './utils'

const resolvers = {
  Query: {
    blockNumber(parent, { number }, context: Context) {
      return context.prisma.blockNumber({ number })
    },
    blockNumberAtHash(parent, { hash }, context: Context) {
      return context.prisma.blockNumber({ hash })
    },
    blockNumbersAuthoredBy(parent, { authoredBy }, context: Context) {
      return context.prisma.blockNumbers({ where: { authoredBy } });
    },
    eraAtIndex(parent, { index }, context: Context) {
      return context.prisma.era({ index })
    },
    erasWhere(parent, { first, orderBy, skip }, context: Context) {
      return context.prisma.eras({ first, orderBy, skip })
    },
    nominationsWhere(parent, where, context: Context) {
      return context.prisma.nominations({ where })
    },
    sessionAtIndex(parent, { index }, context: Context) {
      return context.prisma.session({ index })
    },
    sessionsWhere(parent, { first, orderBy, skip }, context: Context) {
      return context.prisma.sessions({ first, orderBy, skip })
    },
    slashingsAtBlock(parent, { blockNumber }, context: Context) {
      return context.prisma.slashings({ where: { blockNumber } })
    },
    slashingsWhere(parent, { first, orderBy, skip }, context: Context) {
      return context.prisma.slashings({ first, orderBy, skip });
    },
    slashingsAtBlockWhere(parent, { blockNumber, first, orderBy, skip }, context: Context) {
      return context.prisma.slashings({ where: { blockNumber }, first, orderBy, skip });
    },
    validatorsAtSession(parent, { session }, context: Context) {
      return context.prisma.validators({ where: { session } })
    },
    validatorsWhere(parent, { first, orderBy, skip }, context: Context) {
      return context.prisma.validators({ first, orderBy, skip });
    },
    validatorsAtSessionWhere(parent, { session, first, orderBy, skip }, context: Context) {
      return context.prisma.validators({ where: { session }, first, orderBy, skip });
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma },
})
server.start(() => console.log('Server is running on http://localhost:4000'))
