// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { logger } from '@polkadot/util';

import decideHowToWriteIt from './prisma-api';

const l = logger('prisma-writer-queue');

/*
* Handles async/await writing to PSQL with Prisma GraphQL client
* Basically subscriptions to node could move on before async write resolves
* so we put them in a queue here.
*/
export default class PrismaWriterQueue {
  private queue: Array<any>; // FIXME any

  constructor() {
    this.queue = [];
  }

  public length(): number {
    return this.queue.length;
  }

  public enqueue(item: any): void { // FIXME any
    this.queue.push(item);

    l.log(`Queued a thing, ${item}`);
  }

  public peek(): any { // FIXME any
    return this.queue[0];
  }

  public dequeue(): any { // FIXME any
    return this.queue.pop();
  }

  public startQueueRunner(): void {
    setInterval(async () => {
      const nextItem = this.dequeue();

      await decideHowToWriteIt(nextItem);

    }, 6000) // FIXME: set interval to around about the average block time
  }

  public pauseQueueRunner(): void {
    
  }
}