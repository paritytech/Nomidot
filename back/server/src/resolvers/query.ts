// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Context, Selectors } from '../types';

const Query = {
  blockNumbers(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.blockNumbers({
      where,
      orderBy,
      skip,
      after,
      before,
      first,
      last,
    });
  },
  eras(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.eras({
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
    return prisma.heartBeats({
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
    return prisma.nominations({
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
    return prisma.offlineValidators({
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
    return prisma.rewards({
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
    return prisma.stakes({
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
    return prisma.sessions({
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
    return prisma.slashings({
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
    return prisma.totalIssuances({
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
    return prisma.validators({
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
    return prisma.blockNumber(blockNumberWhereUniqueInput);
  },
  era(_parent: any, { eraWhereUniqueInput }: Selectors, { prisma }: Context) {
    return prisma.era(eraWhereUniqueInput);
  },
  nomination(
    _parent: any,
    { nominationWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.nomination(nominationWhereUniqueInput);
  },
  reward(
    _parent: any,
    { rewardWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.reward(rewardWhereUniqueInput);
  },
  session(
    _parent: any,
    { sessionWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.session(sessionWhereUniqueInput);
  },
  slashing(
    _parent: any,
    { slashingWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.slashing(slashingWhereUniqueInput);
  },
  stake(
    _parent: any,
    { stakeWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.stake(stakeWhereUniqueInput);
  },
  totalIssuance(
    _parent: any,
    { totalIssuanceWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.totalIssuance(totalIssuanceWhereUniqueInput);
  },
  validator(
    _parent: any,
    { validatorWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.validator(validatorWhereUniqueInput);
  },
  councils(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.councils({
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
    return prisma.council(councilWhereUniqueInput);
  },
  councilMembers(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.councilMembers({
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
    return prisma.councilMember(councilMemberWhereUniqueInput);
  },
  motionStatus(
    _parent: any,
    { MotionStatusWhereUniqueInput }: Selectors,
    { prisma }: Context
  ) {
    return prisma.motionStatus(MotionStatusWhereUniqueInput);
  },
  motionStatuses(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.motionStatuses({
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
    return prisma.motionProposalArgument(
      MotionProposalArgumentWhereUniqueInput
    );
  },
  motionProposalArguments(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.motionProposalArguments({
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
    return prisma.motion(MotionWhereUniqueInput);
  },
  motions(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.motions({
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
    return prisma.preimages({
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
    return prisma.preimage(PreimageWhereUniqueInput);
  },
  preimageStatuses(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.preimageStatuses({
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
    return prisma.preimageStatus(PreimageStatusWhereUniqueInput);
  },
  proposals(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.proposals({
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
    return prisma.proposal(ProposalWhereUniqueInput);
  },
  proposalStatuses(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.proposalStatuses({
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
    return prisma.proposalStatus(ProposalStatusWhereUniqueInput);
  },
  preimageArguments(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.preimageArguments({
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
    return prisma.preimageArgument(PreimageArgumentWhereUniqueInput);
  },
  treasurySpendProposals(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.treasurySpendProposals({
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
    return prisma.treasurySpendProposal(TreasurySpendProposalWhereUniqueInput);
  },
  treasuryStatuses(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.treasuryStatuses({
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
    return prisma.treasuryStatus(TreasuryStatusWhereUniqueInput);
  },
  referendums(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.referendums({
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
    return prisma.referendum(referendumWhereUniqueInput);
  },
  referendumStatuses(
    _parent: any,
    { where, orderBy, skip, after, before, first, last }: Selectors,
    { prisma }: Context
  ) {
    return prisma.referendumStatuses({
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
    return prisma.referendumStatus(referendumStatusWhereUniqueInput);
  },
};

export { Query };
