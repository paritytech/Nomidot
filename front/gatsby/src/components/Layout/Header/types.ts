// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, Points } from '@polkadot/types/interfaces';

export interface BlockHead {
  authoredBy: string;
  hash: string;
  number: number;
  startDateTime: string;
}

export interface EraHead {
  index: number;
  individualPoints: Array<Points>;
  totalPoints: Points;
}

export interface SessionHead {
  index: number;
}

export interface StakingHead {
  blockNumber: number;
  totalStake: Balance;
}
