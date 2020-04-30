// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Context, Selectors } from '../types';

const Query = {
  blockNumbers(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context,
    info: any
  ) {
    return prisma.query.blockNumbers({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last
    });
  },
  eras(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context,
    info: any
  ) {
    return prisma.query.eras({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  heartBeats(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.heartBeats({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  nominations(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.nominations({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  offlineValidators(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.offlineValidators({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  rewards(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.rewards({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  stakes(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.stakes({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  sessions(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.sessions({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  slashings(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.slashings({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  totalIssuances(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.totalIssuances({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  validators(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.validators({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  blockNumber(
    _parent: any,
    { blockNumberWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.blockNumber(blockNumberWhereUniqueInput);
  },
  era(_parent: any, { eraWhereUniqueInput }: Selectors, { prisma }: Context) {
    return prisma.query.era(eraWhereUniqueInput);
  },
  nomination(
    _parent: any,
    { nominationWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.nomination(nominationWhereUniqueInput);
  },
  reward(
    _parent: any,
    { rewardWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.reward(rewardWhereUniqueInput);
  },
  session(
    _parent: any,
    { sessionWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.session(sessionWhereUniqueInput);
  },
  slashing(
    _parent: any,
    { slashingWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.slashing(slashingWhereUniqueInput);
  },
  stake(
    _parent: any,
    { stakeWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.stake(stakeWhereUniqueInput);
  },
  totalIssuance(
    _parent: any,
    { totalIssuanceWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.totalIssuance(totalIssuanceWhereUniqueInput);
  },
  validator(
    _parent: any,
    { validatorWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.validator(validatorWhereUniqueInput);
  },
  councils(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.councils({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  council(
    _parent: any,
    { councilWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.council(councilWhereUniqueInput);
  },
  councilMembers(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.councilMembers({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  councilMember(
    _parent: any,
    { councilMemberWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.councilMember(councilMemberWhereUniqueInput);
  },
  motionStatus(
    _parent: any,
    { MotionStatusWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.motionStatus(MotionStatusWhereUniqueInput);
  },
  motionStatuses(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.motionStatuses({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  motionProposalArgument(
    _parent: any,
    { MotionProposalArgumentWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.motionProposalArgument(
      MotionProposalArgumentWhereUniqueInput
    );
  },
  motionProposalArguments(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.motionProposalArguments({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  motion(
    _parent: any,
    { MotionWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.motion(MotionWhereUniqueInput);
  },
  motions(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.motions({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  preimages(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.preimages({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  preimage(
    _parent: any,
    { PreimageWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.preimage(PreimageWhereUniqueInput);
  },
  preimageStatuses(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.preimageStatuses({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  preimageStatus(
    _parent: any,
    { PreimageStatusWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.preimageStatus(PreimageStatusWhereUniqueInput);
  },
  proposals(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.proposals({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  proposal(
    _parent: any,
    { ProposalWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.proposal(ProposalWhereUniqueInput);
  },
  proposalStatuses(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.proposalStatuses({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  proposalStatus(
    _parent: any,
    { ProposalStatusWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.proposalStatus(ProposalStatusWhereUniqueInput);
  },
  preimageArguments(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.preimageArguments({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  preimageArgument(
    _parent: any,
    { PreimageArgumentWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.preimageArgument(PreimageArgumentWhereUniqueInput);
  },
  treasurySpendProposals(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.treasurySpendProposals({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  treasurySpendProposal(
    _parent: any,
    { TreasurySpendProposalWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.treasurySpendProposal(TreasurySpendProposalWhereUniqueInput);
  },
  treasuryStatuses(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.treasuryStatuses({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  treasuryStatus(
    _parent: any,
    { TreasuryStatusWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.treasuryStatus(TreasuryStatusWhereUniqueInput);
  },
  referendums(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.referendums({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  referendum(
    _parent: any,
    { referendumWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.referendum(referendumWhereUniqueInput);
  },
  referendumStatuses(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.referendumStatuses({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  referendumStatus(
    _parent: any,
    { referendumStatusWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.query.referendumStatus(referendumStatusWhereUniqueInput);
  },
};

export { Query };
