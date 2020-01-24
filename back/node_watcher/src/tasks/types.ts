// Copyright 2018-2020 @paritytech/nomidot authors & contributors
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
  VoteThreshold,
} from '@polkadot/types/interfaces';

export interface Task<T> {
  name: string;
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
  validatorPreferences?: ValidatorPrefs;
  currentSessionIndex: SessionIndex;
}

export type Nomidot =
  | NomidotBlock
  | NomidotEra
  | NomidotHeartBeat
  | NomidotPreimage[]
  | NomidotProposalStatusUpdate[]
  | NomidotProposal[]
  | NomidotReferendum[]
  | NomidotSession
  | NomidotSlashing[]
  | NomidotTotalIssuance
  | NomidotValidator[];

export type NomidotTask = Task<Nomidot>;

export interface NomidotProposal extends NomidotProposalEvent {
  author: AccountId;
  preimageHash: Hash;
  status: ProposalStatus;
}

export interface NomidotProposalEvent {
  depositAmount: Balance;
  proposalId: number;
}

export interface NomidotProposalRawEvent {
  PropIndex?: number;
  Balance?: Balance;
}

export interface NomidotReferendum {
  delay: BlockNumber;
  end: BlockNumber;
  preimageHash: Hash;
  referendumIndex: number;
  status: ReferendumStatus;
  voteThreshold: VoteThreshold;
}

export interface NomidotReferendumRawEvent {
  ReferendumIndex?: number;
  VoteThreshold?: VoteThreshold;
}

export interface NomidotArgument {
  name: string;
  value: string;
}

export enum PreimageStatus {
  NOTED = 'Noted',
  REAPED = 'Reaped',
  USED = 'Used',
}

export enum ProposalStatus {
  PROPOSED = 'Proposed',
  TABLED = 'Tabled',
}

export enum ReferendumStatus {
  CANCELLED = ' Cancelled',
  EXECUTED = 'Executed',
  NOTPASSED = 'NotPassed',
  PASSED = 'Passed',
  STARTED = 'Started',
}

export interface NomidotPreimage extends NomidotPreimageEvent {
  preImageArguments: NomidotArgument[];
  metaDescription: string;
  method: string;
  section: string;
  status: PreimageStatus;
}

export interface NomidotPreimageEvent {
  hash: Hash;
  author: AccountId;
  depositAmount: Balance;
}

export interface NomidotPreimageRawEvent {
  Hash?: Hash;
  AccountId?: AccountId;
  Balance?: Balance;
}

export interface NomidotProposalStatusUpdate {
  proposalId: number;
  status: ProposalStatus;
}
