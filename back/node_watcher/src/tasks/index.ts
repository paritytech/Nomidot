// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import createBlockNumber from './createBlockNumber';
import createEra from './createEra';
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
import createValidator from './createValidator';
import { NomidotTask } from './types';

// N.B. Order of tasks matters here
export const nomidotTasks: NomidotTask[] = [
  createBlockNumber,
  createSession,
  createStake
  // createOfflineValidator,
  // createReward,
  // createEra,
  // createSlashing,
  // createTotalIssuance,
  // createValidator,
  // createPreimage,
  // createProposal,
  // createProposalStatus,
  // createReferendum,
  // createReferendumStatus,
];
