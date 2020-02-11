// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import createBlockNumber from './createBlockNumber';
import createEra from './createEra';
import createMotion from './createMotion';
import createMotionStatus from './createMotionStatus';
import createPreimage from './createPreimage';
import createProposal from './createProposal';
import createProposalStatus from './createProposalStatus';
import createReferendum from './createReferendum';
import createReferendumStatus from './createReferendumStatus';
import createSession from './createSession';
import createSlashing from './createSlashing';
import createTotalIssuance from './createTotalIssuance';
import createValidator from './createValidator';
import { NomidotTask } from './types';

// N.B. Order of tasks matters here
export const nomidotTasks: NomidotTask[] = [
  createBlockNumber,
  // createSession,
  // createEra,
  // createSlashing,
  // createTotalIssuance,
  // createValidator,
  createPreimage,
  createMotion,
  createMotionStatus,
  createProposal,
  createProposalStatus,
  createReferendum,
  createReferendumStatus,
];
