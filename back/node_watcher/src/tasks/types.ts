// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Compact } from '@polkadot/types';
import {
  AccountId,
  Balance,
  BlockNumber,
  EraIndex,
  EraPoints,
  Hash,
  Index,
  IndividualExposure,
  Moment,
  SessionIndex,
  ValidatorId,
  ValidatorPrefs,
  VoteThreshold,
} from '@polkadot/types/interfaces';

import {
  preimageStatus,
  proposalStatus,
  referendumStatus,
} from '../util/statuses';

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
  authorityId: AccountId;
  sessionIndex: SessionIndex;
}

export interface NomidotOfflineValidator {
  sessionIndex: SessionIndex;
  validatorId: ValidatorId;
  total: Compact<Balance>;
  own: Compact<Balance>;
  others: IndividualExposure[];
}

export interface NomidotReward {
  authoredBlock: Hash;
  sessionIndex: SessionIndex;
  treasuryReward: Balance; // remainder goes to treasury
  validatorReward: Balance; // all validators get rewarded by this amount
}

export interface NomidotNomination {
  validatorController: AccountId;
  validatorStash: AccountId;
  nominatorController: AccountId;
  nominatorStash: AccountId;
  session: SessionIndex;
  stakedAmount: Compact<Balance>;
}

export interface NomidotSession {
  didNewSessionStart: boolean;
  idx: SessionIndex;
}

export interface NomidotStake {
  totalStaked: Balance;
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
  | NomidotOfflineValidator[]
  | NomidotHeartBeat[]
  | NomidotNomination[]
  | NomidotPreimage[]
  | NomidotProposalStatusUpdate[]
  | NomidotProposal[]
  | NomidotReferendum[]
  | NomidotReferendumStatusUpdate[]
  | NomidotReward[]
  | NomidotSession
  | NomidotSlashing[]
  | NomidotStake
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

type ProposalStatus = typeof proposalStatus[keyof typeof proposalStatus];

type PreimageStatus = typeof preimageStatus[keyof typeof preimageStatus];

type ReferendumStatus = typeof referendumStatus[keyof typeof referendumStatus];

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

export interface NomidotReferendumStatusUpdate {
  referendumId: number;
  status: string;
}
