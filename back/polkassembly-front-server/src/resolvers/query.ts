// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Context, Selectors } from '../types';

const Query = {
  blockNumber(
    parent: any,
    { blockNumberWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.blockNumber(blockNumberWhereUniqueInput);
  },

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

  preimages(
    parent: any,
    {
      preimageWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.preimages({
      where: preimageWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },

  preimage(
    parent: any,
    { PreimageWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.preimage(PreimageWhereUniqueInput);
  },

  preimageStatuses(
    parent: any,
    {
      PreimageStatusWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.preimageStatuses({
      where: PreimageStatusWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },

  preimageStatus(
    parent: any,
    { PreimageStatusWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.preimageStatus(PreimageStatusWhereUniqueInput);
  },

  proposals(
    parent: any,
    {
      ProposalWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.proposals({
      where: ProposalWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },

  proposal(
    parent: any,
    { ProposalWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.proposal(ProposalWhereUniqueInput);
  },
  proposalStatuses(
    parent: any,
    {
      ProposalStatusWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.proposalStatuses({
      where: ProposalStatusWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },

  proposalStatus(
    parent: any,
    { ProposalStatusWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.proposalStatus(ProposalStatusWhereUniqueInput);
  },
  preimageArguments(
    parent: any,
    {
      PreimageArgumentWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.preimageArguments({
      where: PreimageArgumentWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },

  preimageArgument(
    parent: any,
    { PreimageArgumentWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.preimageArgument(PreimageArgumentWhereUniqueInput);
  },

  referendums(
    parent: any,
    {
      referendumWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.referendums({
      where: referendumWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },

  referendum(
    parent: any,
    { referendumWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.referendum(referendumWhereUniqueInput);
  },

  referendumStatuses(
    parent: any,
    {
      referendumStatusWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.referendumStatuses({
      where: referendumStatusWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },

  referendumStatus(
    parent: any,
    { referendumStatusWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.referendumStatus(referendumStatusWhereUniqueInput);
  },
};

export { Query };
