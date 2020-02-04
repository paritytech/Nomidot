
import { Context, Selectors } from '../types';

const Query = {
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
      skip
    });
  },
}

export {
  Query
}