// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import shortid from 'shortid';

import { toShortAddress } from '../../util';
import { AddressSummary, Tc, Tr } from '../index';
import BalanceColumns from './BalanceColumns';
import { UnbondedAccountRowProps } from './types';

const UnbondedAccountRow = (
  props: UnbondedAccountRowProps
): React.ReactElement => {
  const { account, api } = props;

  return (
    <Tr key={shortid.generate()}>
      <Tc>
        <AddressSummary
          address={account.address}
          api={api}
          name={account.meta.name}
          noBalance
          size='tiny'
        />
      </Tc>
      <Tc>{toShortAddress(account.address)}</Tc>
      <BalanceColumns account={account.address} />
    </Tr>
  );
};

export default React.memo(UnbondedAccountRow);
