// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { prisma } from '../generated/prisma-client';
import { BlockInfoFromNode } from './types';

export default decideHowToWriteIt = (item: any) => {
  switch(item.type) {
    case 'blockNumber':
      writeBlockNumber(item.data)
      break;
    case 'imOnline':
      break;
    case 'rewards':
      break;
    case 'slashing':
        break;
    case 'nominations':
      break;
    case 'stake':
      break;
    case 'validations':
      break;
    case 'sessions':
      break;
    case 'totalIssuance':
      break;
  }
}

const writeBlockNumber = async ({ block_number, authored_by, block_hash }: BlockInfoFromNode) => {
  const number = parseInt(block_number.toString());

  await prisma.createBlockNumber({
    number,
    authored_by: authored_by.toString(),
    start_datetime: new Date().toISOString(),
    hash: block_hash.toHex()
  })
}

