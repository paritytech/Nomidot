// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumberSubscriptionPayloadSubscription } from '../generated/prisma-client'
import { Context } from '../types';

const subscribeBestHead = (parent: any, args: any, context: Context): BlockNumberSubscriptionPayloadSubscription => {
  return context.prisma.$subscribe.blockNumber({
    // @ts-ignore
    mutation_in: ['CREATED'],
  });
};

const chainBestBlockNumber = {
  subscribe: subscribeBestHead,
  resolve: (payload: any) => {
    return payload;
  },
};

export const Subscription = {
  chainBestBlockNumber,
};
