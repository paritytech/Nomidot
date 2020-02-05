// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Context, Selectors } from '../types';

const Query = {
  blockNumbers(
    parent: any,
    {
      blockNumberWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.blockNumbers({
      where: blockNumberWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  eras(
    parent: any,
    { eraWhereInput, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.blockNumbers({
      where: eraWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  nominations(
    parent: any,
    {
      nominationsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.nominations({
      where: nominationsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  stakes(
    parent: any,
    { stakesWhereInput, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.stakes({
      where: stakesWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  sessions(
    parent: any,
    {
      sessionsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.sessions({
      where: sessionsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  rewards(
    parent: any,
    { rewardsWhereInput, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.slashings({
      where: rewardsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  slashings(
    parent: any,
    {
      slashingsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.slashings({
      where: slashingsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  totalIssuances(
    parent: any,
    {
      totalIssuancesWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.validators({
      where: totalIssuancesWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  validators(
    parent: any,
    {
      validatorsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.validators({
      where: validatorsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  blockNumber(
    parent: any,
    { blockNumberWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.blockNumber(blockNumberWhereUniqueInput);
  },
  era(parent: any, { eraWhereUniqueInput }: Selectors, { prisma }: Context) {
    return prisma.era(eraWhereUniqueInput);
  },
  nomination(
    parent: any,
    { nominationWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.nomination(nominationWhereUniqueInput);
  },
  reward(
    parent: any,
    { rewardWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.reward(rewardWhereUniqueInput);
  },
  session(
    parent: any,
    { sessionWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.session(sessionWhereUniqueInput);
  },
  slashing(
    parent: any,
    { slashingWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.slashing(slashingWhereUniqueInput);
  },
  stake(
    parent: any,
    { stakeWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.stake(stakeWhereUniqueInput);
  },
  totalIssuance(
    parent: any,
    { totalIssuanceWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.totalIssuance(totalIssuanceWhereUniqueInput);
  },
  validator(
    parent: any,
    { validatorWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.validator(validatorWhereUniqueInput);
  },
};

export { Query };
