import { Context } from '../types';

const subscribeBestHead = (parent: any, args: any, context: Context) => {
  return context.prisma.$subscribe.blockNumber(
    {
      mutation_in: ['CREATED']
    }
  )
}

const chainBestBlockNumber = {
  subscribe: subscribeBestHead,
  resolve: (payload: any) => {
    return payload
  }
}

export const Subscription = {
  chainBestBlockNumber
}