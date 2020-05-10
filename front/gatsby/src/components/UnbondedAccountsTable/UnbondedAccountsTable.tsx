// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountsContext } from '@substrate/context';
import React, { useContext } from 'react';

import { Table, Tb, Th, Thead, Tr } from '../index';
import { UnbondedAccountsTableProps } from './types';
import UnbondedAccountRow from './UnbondedAccountRow';

const UnbondedAccountsTable = (
  props: UnbondedAccountsTableProps
): React.ReactElement => {
  const { api } = props;
  const {
    state: { allAccounts, allStashes },
  } = useContext(AccountsContext);

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Unbonded Accounts</Th>
        </Tr>
        <Tr>
          <Th>Account</Th>
          <Th>Address</Th>
          <Th>Locked</Th>
          <Th>Reserved Balance</Th>
          <Th>Transferrable</Th>
        </Tr>
      </Thead>
      <Tb>
        {allAccounts
          .filter(
            (account: InjectedAccountWithMeta) =>
              !allStashes.includes(account.address)
          )
          .map((account: InjectedAccountWithMeta) => (
            <UnbondedAccountRow
              account={account}
              api={api}
              key={account.address}
            />
          ))}
      </Tb>
    </Table>
  );
};

export default React.memo(UnbondedAccountsTable);
