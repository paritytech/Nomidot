// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { Compact, Option } from '@polkadot/types';
import {
  AccountId,
  Balance,
  BlockNumber,
  EraIndex,
  EraPoints,
  EraRewardPoints,
  EventRecord,
  Hash,
  IndividualExposure,
  Moment,
  SessionIndex,
  ValidatorId,
  ValidatorPrefs,
  VoteThreshold,
} from '@polkadot/types/interfaces';

import {
  motionStatus,
  preimageStatus,
  proposalStatus,
  referendumStatus,
} from '../util/statuses';

export interface Task<T> {
  name: string;
  read(blockHash: Hash, cached: Cached, api: ApiPromise): Promise<T>;
  write(blockNumber: BlockNumber, value: T): Promise<void>;
}

export interface Cached {
  events: EventRecord[];
  sessionIndex: SessionIndex;
}

export interface NomidotBlock {
  authoredBy: AccountId;
  hash: Hash;
  startDateTime: Moment;
}

export interface NomidotEra {
  idx: Option<EraIndex>;
  points: EraRewardPoints | EraPoints;
  startSessionIndex: SessionIndex;
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

export interface NomidotNominationAndValidators {
  nominatorController: AccountId | null;
  nominatorStash: AccountId | null;
  session: SessionIndex;
  stakedAmount: Compact<Balance>;
  validatorController: AccountId | null;
  validatorStash: AccountId | null;
  validatorPreferences?: ValidatorPrefs;
}

export interface NomidotSession {
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

export type Nomidot =
  | NomidotBlock
  | NomidotCouncil
  | NomidotEra
  | NomidotOfflineValidator[]
  | NomidotHeartBeat[]
  | Set<NomidotNominationAndValidators>
  | NomidotHeartBeat
  | NomidotMotion[]
  | NomidotMotionStatusUpdate[]
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
  | NomidotTreasury[];

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

export interface NomidotTreasury {
  treasuryProposalId: number;
  proposer: AccountId;
  beneficiary: AccountId;
  value: Balance;
  bond: Balance;
  status: string;
}

export interface NomidotTreasuryRawEvent {
  ProposalIndex?: number;
}

export interface NomidotRewardEvent extends EventRecord {
  treasuryReward: Balance;
  validatorReward: Balance;
}

export interface NomidotMotion {
  author: AccountId;
  memberCount: number;
  metaDescription: string;
  method: string;
  motionProposalArguments: NomidotArgument[];
  motionProposalHash: Hash;
  motionProposalId: number;
  preimageHash: string | null;
  section: string;
  status: MotionStatus;
}

export interface NomidotMotionRawEvent {
  ProposalIndex?: number;
  AccountId?: AccountId;
  Hash?: Hash;
  MemberCount?: number;
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
type MotionStatus = typeof motionStatus[keyof typeof motionStatus];

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

export interface NomidotMotionStatusUpdate {
  motionProposalId: number;
  status: MotionStatus;
}

export interface NomidotReferendumStatusUpdate {
  referendumId: number;
  status: string;
}

export type NomidotCouncil = AccountId[];
