// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Prisma } from './generated/prisma-client';

export interface Context {
  prisma: Prisma;
}

export type Selectors = Record<string, any>;
