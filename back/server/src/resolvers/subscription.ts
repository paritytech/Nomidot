// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  BlockNumberSubscription,
  SessionSubscription,
} from '../generated/prisma-client';
import { Context, Selectors } from '../types';

const chainBestBlockNumber = {
  subscribe: (
    parent: any,
    { blockNumberSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = BlockNumberSubscription>() => T) => {
    return context.prisma.$subscribe
      .blockNumber({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...blockNumberSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const subscribeNewSession = {
  subscribe: (
    parent: any,
    { sessionSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = SessionSubscription>() => T) => {
    return context.prisma.$subscribe
      .session({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...sessionSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

export const Subscription = {
  chainBestBlockNumber,
  subscribeNewSession,
};
