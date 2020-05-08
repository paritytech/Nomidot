// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import React, { useContext } from 'react';

import { Tc } from '../index';
import { BalanceColumnsProps } from './types';

const BalanceColumns = (props: BalanceColumnsProps): React.ReactElement => {
  const { account } = props;
  const {
    state: { accountBalanceMap },
  } = useContext(AccountsContext);

  const thisAccount = accountBalanceMap[account];

  // all these checks are a sign something else is wrong
  return (
    <>
      <Tc>
        {thisAccount &&
        thisAccount.lockedBalance &&
        thisAccount.lockedBalance.toHuman ? (
          thisAccount.lockedBalance.toHuman()
        ) : (
          <Spinner active inline />
        )}
      </Tc>
      <Tc>
        {thisAccount &&
        thisAccount.reservedBalance &&
        thisAccount.reservedBalance.toHuman ? (
          thisAccount.reservedBalance.toHuman()
        ) : (
          <Spinner active inline />
        )}
      </Tc>
      <Tc>
        {thisAccount &&
        thisAccount.freeBalance &&
        thisAccount.freeBalance.toHuman ? (
          thisAccount.freeBalance.toHuman()
        ) : (
          <Spinner active inline />
        )}
      </Tc>
    </>
  );
};

export default React.memo(BalanceColumns);
