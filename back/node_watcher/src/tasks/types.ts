// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import {
  AccountId,
  Balance,
  BlockNumber,
  EraIndex,
  EraPoints,
  Hash,
  Index,
  Moment,
  SessionIndex,
  ValidatorPrefs,
} from '@polkadot/types/interfaces';

export interface Task<T> {
  name: string,
  read(blockHash: Hash, api: ApiPromise): Promise<T>;
  write(blockNumber: BlockNumber, value: T): Promise<void>;
}

export interface NomidotBlock {
  authoredBy: AccountId;
  hash: Hash;
  startDateTime: Moment;
}

export interface NomidotEra {
  idx: EraIndex;
  points: EraPoints;
  startSessionIndex: Index;
}

export interface NomidotHeartBeat {
  isOnline: boolean;
  sender: AccountId;
  sessionId: SessionIndex;
}

export interface NomidotSession {
  didNewSessionStart: boolean;
  idx: SessionIndex;
}

export interface NomidotSlashing {
  who: AccountId;
  amount: Balance;
}

export interface NomidotTotalIssuance {
  amount: Balance;
}

export interface NomidotValidator {
  controller: AccountId;
  stash: AccountId;
  validatorPreferences: ValidatorPrefs;
}

export type Nomidot =
  | NomidotBlock
  | NomidotEra
  | NomidotHeartBeat
  | NomidotSession
  | NomidotSlashing[]
  | NomidotTotalIssuance
  | NomidotValidator[];

export type NomidotTask = Task<Nomidot>;
