// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import shortid from 'shortid';

import { Tr } from '../index';
import ActionsForBonded from './ActionsForBonded';
import StakingQueryColumns from './StakingQueryColumns';
import StashColumn from './StashColumn';
import { BondedAccountRowProps } from './types';

// n.b. doesnt make sense to render balacne here because it's not clear to the user whether the balance is for the stash or the controller. Would make sense to defer that to account details page.
const BondedAccountRow = (props: BondedAccountRowProps): React.ReactElement => {
  const { account, api } = props;

  return (
    <Tr key={shortid.generate()}>
      <StashColumn account={account} api={api} />
      <StakingQueryColumns account={account} api={api} />
      <ActionsForBonded stashId={account} />
    </Tr>
  );
};

export default React.memo(BondedAccountRow);
