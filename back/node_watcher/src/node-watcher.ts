// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { logger } from '@polkadot/util';
import { from } from 'rxjs';

import NodeApi from './node-api';
import PrismaClient from './prisma-api';
import { NodeWatcherOptions } from './types';

const BLOCK_NUMBER_RANGE: Array<number> = new Array(Number.MAX_SAFE_INTEGER);

const l = logger('node-watcher');

class NodeWatcher {
  private nodeApiInstance: NodeApi;
  private prismaClient: PrismaClient;

  constructor(api: ApiPromise, options: NodeWatcherOptions) {
    this.nodeApiInstance = new NodeApi(api, options);
    this.prismaClient = new PrismaClient();
  }

  public start() {
    from(BLOCK_NUMBER_RANGE) // fixme: make range to max safe integer
      .subscribe((number: number) => {
        l.log(`writing block number: ${number}`);
        this.readFromNodeAndWriteToPrisma(number);
      });
  }

  public readFromNodeAndWriteToPrisma = async (blockNumber: number) => {
    const blockData = await this.nodeApiInstance.read(blockNumber);

    await this.prismaClient.write(blockData);
  }
}

export default NodeWatcher;