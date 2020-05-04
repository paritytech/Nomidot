// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRx } from '@polkadot/api';

export interface BondedAccountsTableProps {
  api: ApiRx;
}

export interface BondedAccountRowProps extends BondedAccountsTableProps {
  account: string;
}

export type StakingQueryColumnsProps = BondedAccountRowProps;

export type StashColumnProps = BondedAccountRowProps;

export interface ActionsForBondedProps {
  stashId: string;
}
