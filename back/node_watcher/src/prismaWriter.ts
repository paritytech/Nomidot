// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { prisma } from '../generated/prisma-client';
import { BlockInfoFromNode } from './types';

/*
* Handles async/await writing to PSQL with Prisma GraphQL client
* Basically subscriptions to node could move on before async write resolves
* so we put them in a queue here.
*/
export default class PrismaWriter {
  queue: Array<any> = [];

  constructor() {
    let queue = this.queue;
  }

  public addToQueue(item: any): void { // FIXME any
    this.queue.push(item);
  }

  private async writeBlockNumber({ block_number, authored_by, block_hash }: BlockInfoFromNode) {
    const number = parseInt(block_number.toString());

    await prisma.createBlockNumber({
      number,
      authored_by: authored_by.toString(),
      start_datetime: new Date().toISOString(),
      hash: block_hash.toHex()
    })
  }
  
}