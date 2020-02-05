
import { Context, Selectors } from '../types';

const Query = {
  blockNumbers(parent: any, { blockNumberWhereInput, orderBy, skip, after, before, first, last }: Selectors, { prisma }: Context) {
    return prisma.blockNumbers({
      where: blockNumberWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last
    })
  },
  eras(parent: any, { eraWhereInput, orderBy, skip, after, before, first, last }: Selectors, { prisma }: Context) {
    return prisma.blockNumbers({
      where: eraWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last
    })
  },
  nominations(parent: any, { nominationsWhereInput, orderBy, skip, after, before, first, last }: Selectors, { prisma }: Context) {
    return prisma.nominations({
      where: nominationsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last
    })
  },
  stakes(parent: any, { stakesWhereInput, orderBy, skip, after, before, first, last }: Selectors, { prisma }: Context) {
    return prisma.stakes({
      where: stakesWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last
    })
  },
  sessions(parent: any, { sessionsWhereInput, orderBy, skip, after, before, first, last }: Selectors, { prisma }: Context) {
    return prisma.sessions({
      where: sessionsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last
    })
  },
  rewards(parent: any, { rewardsWhereInput, orderBy, skip, after, before, first, last }: Selectors, { prisma }: Context) {
    return prisma.slashings({
      where: rewardsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last
    })
  },
  slashings(parent: any, { slashingsWhereInput, orderBy, skip, after, before, first, last }: Selectors, { prisma }: Context) {
    return prisma.slashings({
      where: slashingsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last
    })
  },
  totalIssuances(parent: any, { totalIssuancesWhereInput, orderBy, skip, after, before, first, last }: Selectors, { prisma }: Context) {
    return prisma.validators({
      where: totalIssuancesWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last
    })
  },
  validators(parent: any, { validatorsWhereInput, orderBy, skip, after, before, first, last }: Selectors, { prisma }: Context) {
    return prisma.validators({
      where: validatorsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last
    })
  },
}

export {
  Query
}