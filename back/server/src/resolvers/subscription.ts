import { Context } from '../types';

const subscribeBestHead = (parent: any, args, context: Context, info) => {
  return context.prisma.$subscribe.blockNumber(
    {
      mutation_in: ['CREATED', 'UPDATED']
    }
  ).node()
}

const chainBestBlockNumber = {
  subscribe: subscribeBestHead,
  resolve: (payload) => {
    return payload
  }
}

export const Subscription = {
  chainBestBlockNumber
}