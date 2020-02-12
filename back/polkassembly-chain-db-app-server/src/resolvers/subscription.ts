// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  ProposalSubscription,
  ReferendumSubscription,
} from '../generated/prisma-client';
import { Context, Selectors } from '../types';

const subscribeProposal = {
  subscribe: (
    parent: any,
    { proposalSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = ProposalSubscription>() => T) => {
    return context.prisma.$subscribe
      .proposal({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...proposalSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const subscribeReferendum = {
  subscribe: (
    parent: any,
    { referendumSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = ReferendumSubscription>() => T) => {
    return context.prisma.$subscribe
      .referendum({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...referendumSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

export const Subscription = {
  subscribeProposal,
  subscribeReferendum,
};
