// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  BlockNumberSubscription,
  EraSubscription,
  NominationSubscription,
  RewardSubscription,
  SessionSubscription,
  SlashingSubscription,
  ValidatorSubscription,
} from '../generated/prisma-client';
import { Context, Selectors } from '../types';

const subscribeBlockNumbers = {
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

const subscribeEras = {
  subscribe: (
    parent: any,
    { eraSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = EraSubscription>() => T) => {
    return context.prisma.$subscribe
      .era({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...eraSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const subscribeNominations = {
  subscribe: (
    parent: any,
    { nominationSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = NominationSubscription>() => T) => {
    return context.prisma.$subscribe
      .nomination({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...nominationSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const subscribeRewards = {
  subscribe: (
    parent: any,
    { rewardSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = RewardSubscription>() => T) => {
    return context.prisma.$subscribe
      .reward({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...rewardSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const subscribeSessions = {
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

const subscribeSlashings = {
  subscribe: (
    parent: any,
    { slashingSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = SlashingSubscription>() => T) => {
    return context.prisma.$subscribe
      .slashing({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...slashingSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

const subscribeValidators = {
  subscribe: (
    parent: any,
    { validatorSubscriptionWhereInput }: Selectors,
    context: Context
  ): (<T = ValidatorSubscription>() => T) => {
    return context.prisma.$subscribe
      .validator({
        // eslint-disable-next-line
        mutation_in: ['CREATED'],
        ...validatorSubscriptionWhereInput,
      })
      .node();
  },
  resolve: (payload: any) => {
    return payload;
  },
};

export const Subscription = {
  subscribeBlockNumbers,
  subscribeEras,
  subscribeNominations,
  subscribeRewards,
  subscribeSessions,
  subscribeSlashings,
  subscribeValidators,
};
