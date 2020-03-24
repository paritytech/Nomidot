// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import createBlockNumber from './createBlockNumber';
import createCouncil from './createCouncil';
import createEra from './createEra';
import createMotion from './createMotion';
import createMotionStatus from './createMotionStatus';
import createNominationAndValidators from './createNominationAndValidators';
import createOfflineValidator from './createOfflineValidator';
import createPreimage from './createPreimage';
import createProposal from './createProposal';
import createProposalStatus from './createProposalStatus';
import createReferendum from './createReferendum';
import createReferendumStatus from './createReferendumStatus';
import createReward from './createReward';
import createSession from './createSession';
import createSlashing from './createSlashing';
import createStake from './createStake';
import createTotalIssuance from './createTotalIssuance';
import createTreasury from './createTreasury';
import { NomidotTask } from './types';

// N.B. Order of tasks matters here
export const nomidotTasks: NomidotTask[] = [
  createBlockNumber,
  createCouncil,
  createSession,
  createStake,
  createOfflineValidator,
  createReward,
  createEra,
  createSlashing,
  createTotalIssuance,
  createNominationAndValidators,
  createPreimage,
  createProposal,
  createProposalStatus,
  createReferendum,
  createReferendumStatus,
  createMotion,
  createMotionStatus,
  createTreasury,
];
