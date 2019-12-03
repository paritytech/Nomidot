// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import createBlockNumber from './createBlockNumber';
import createEra from './createEra';
import createSession from './createSession';
import createSlashing from './createSlashing';
import createTotalIssuance from './createTotalIssuance';
import createValidator from './createValidator';
import { NomidotTask } from './types';

// N.B. Order of tasks matters here
export const nomidotTasks: NomidotTask[] = [
  createBlockNumber,
  createSession,
  createEra,
  createSlashing,
  createTotalIssuance,
  createValidator,
];
