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
    return prisma.eras({
      where: eraWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  heartBeats(
    parent: any,
    {
      heartBeatWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.heartBeats({
      where: heartBeatWhereInput,
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
  offlineValidators(
    parent: any,
    {
      offlineValidatorsWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.offlineValidators({
      where: offlineValidatorsWhereInput,
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
    return prisma.rewards({
      where: rewardsWhereInput,
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
    return prisma.totalIssuances({
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
  councils(
    parent: any,
    { councilWhereInput, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.councils({
      where: councilWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  council(
    parent: any,
    { councilWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.council(councilWhereUniqueInput);
  },
  councilMembers(
    parent: any,
    {
      councilMemberWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.councilMembers({
      where: councilMemberWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  councilMember(
    parent: any,
    { councilMemberWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.councilMember(councilMemberWhereUniqueInput);
  },
  motionStatus(
    parent: any,
    { MotionStatusWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.motionStatus(MotionStatusWhereUniqueInput);
  },
  motionStatuses(
    parent: any,
    {
      MotionStatusWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.motionStatuses({
      where: MotionStatusWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  motionProposalArgument(
    parent: any,
    { MotionProposalArgumentWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.motionProposalArgument(
      MotionProposalArgumentWhereUniqueInput
    );
  },
  motionProposalArguments(
    parent: any,
    {
      MotionProposalArgumentWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    }: Selectors,
    { prisma }: Context
  ) {
    return prisma.motionProposalArguments({
      where: MotionProposalArgumentWhereInput,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  motion(
    parent: any,
    { MotionWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.motion(MotionWhereUniqueInput);
  },
  motions(
    parent: any,
    { MotionWhereInput, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.motions({
      where: MotionWhereInput,
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
