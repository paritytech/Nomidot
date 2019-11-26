// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';

import NodeApi from './node-api';
import { prisma } from '../generated/prisma-client';
import { BlockInfoFromNode, ClientOptions, PrismaEntry } from './types';

class PrismaClient {

  constructor() {}

  public write (blockData: any) {
    // write stuff to prisma.blahblah
  }
}

export default PrismaClient;