// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Context, Selectors } from '../types';

const Query = {
  // preimage(where: PreimageWhereUniqueInput!): Preimage
  // preimages(where: PreimageWhereInput, orderBy: PreimageOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Preimage]!
  // preimagesConnection(where: PreimageWhereInput, orderBy: PreimageOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PreimageConnection!
  // preimageArgument(where: PreimageArgumentWhereUniqueInput!): PreimageArgument
  // preimageArguments(where: PreimageArgumentWhereInput, orderBy: PreimageArgumentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [PreimageArgument]!
  // preimageArgumentsConnection(where: PreimageArgumentWhereInput, orderBy: PreimageArgumentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PreimageArgumentConnection!
  // preimageStatus(where: PreimageStatusWhereUniqueInput!): PreimageStatus
  // preimageStatuses(where: PreimageStatusWhereInput, orderBy: PreimageStatusOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [PreimageStatus]!
  // preimageStatusesConnection(where: PreimageStatusWhereInput, orderBy: PreimageStatusOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PreimageStatusConnection!
  // proposal(where: ProposalWhereUniqueInput!): Proposal
  // proposals(where: ProposalWhereInput, orderBy: ProposalOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Proposal]!
  // proposalsConnection(where: ProposalWhereInput, orderBy: ProposalOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ProposalConnection!
  // proposalStatus(where: ProposalStatusWhereUniqueInput!): ProposalStatus
  // proposalStatuses(where: ProposalStatusWhereInput, orderBy: ProposalStatusOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [ProposalStatus]!
  // proposalStatusesConnection(where: ProposalStatusWhereInput, orderBy: ProposalStatusOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ProposalStatusConnection!
  // referendum(where: ReferendumWhereUniqueInput!): Referendum
  // referendums(where: ReferendumWhereInput, orderBy: ReferendumOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Referendum]!
  // referendumsConnection(where: ReferendumWhereInput, orderBy: ReferendumOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ReferendumConnection!
  // referendumStatus(where: ReferendumStatusWhereUniqueInput!): ReferendumStatus
  // referendumStatuses(where: ReferendumStatusWhereInput, orderBy: ReferendumStatusOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [ReferendumStatus]!
  // referendumStatusesConnection(where: ReferendumStatusWhereInput, orderBy: ReferendumStatusOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ReferendumStatusConnection!

  preimages( parent: any,
    {preimageWhereInput, orderBy, skip, after, before, first, last,}: Selectors,
    { prisma }: Context
    ){
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
  // eras(
  //   parent: any,
  //   { eraWhereInput, orderBy, skip, after, before, first, last }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.eras({
  //     where: eraWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   });
  // },
  // nominations(
  //   parent: any,
  //   {
  //     nominationsWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.nominations({
  //     where: nominationsWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   });
  // },
  // stakes(
  //   parent: any,
  //   { stakesWhereInput, orderBy, skip, after, before, first, last }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.stakes({
  //     where: stakesWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   });
  // },
  // sessions(
  //   parent: any,
  //   {
  //     sessionsWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.sessions({
  //     where: sessionsWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   });
  // },
  // rewards(
  //   parent: any,
  //   { rewardsWhereInput, orderBy, skip, after, before, first, last }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.rewards({
  //     where: rewardsWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   });
  // },
  // slashings(
  //   parent: any,
  //   {
  //     slashingsWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.slashings({
  //     where: slashingsWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   });
  // },
  // totalIssuances(
  //   parent: any,
  //   {
  //     totalIssuancesWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.totalIssuances({
  //     where: totalIssuancesWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   });
  // },
  // validators(
  //   parent: any,
  //   {
  //     validatorsWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.validators({
  //     where: validatorsWhereInput,
  //     orderBy,
  //     skip,
  //     after,
  //     before,
  //     first,
  //     last,
  //   });
  // },
  // blockNumber(
  //   parent: any,
  //   { blockNumberWhereUniqueInput }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.blockNumber(blockNumberWhereUniqueInput);
  // },
  // era(parent: any, { eraWhereUniqueInput }: Selectors, { prisma }: Context) {
  //   return prisma.era(eraWhereUniqueInput);
  // },
  // nomination(
  //   parent: any,
  //   { nominationWhereUniqueInput }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.nomination(nominationWhereUniqueInput);
  // },
  // reward(
  //   parent: any,
  //   { rewardWhereUniqueInput }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.reward(rewardWhereUniqueInput);
  // },
  // session(
  //   parent: any,
  //   { sessionWhereUniqueInput }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.session(sessionWhereUniqueInput);
  // },
  // slashing(
  //   parent: any,
  //   { slashingWhereUniqueInput }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.slashing(slashingWhereUniqueInput);
  // },
  // stake(
  //   parent: any,
  //   { stakeWhereUniqueInput }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.stake(stakeWhereUniqueInput);
  // },
  // totalIssuance(
  //   parent: any,
  //   { totalIssuanceWhereUniqueInput }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.totalIssuance(totalIssuanceWhereUniqueInput);
  // },
  // validator(
  //   parent: any,
  //   { validatorWhereUniqueInput }: Selectors,
  //   { prisma }: Context
  // ) {
  //   return prisma.validator(validatorWhereUniqueInput);
  // },
};

export { Query };
