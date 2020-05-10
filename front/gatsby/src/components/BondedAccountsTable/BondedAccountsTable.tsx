// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext } from '@substrate/context';
import React, { useContext } from 'react';

import { Table, Tb, Tc, Th, Thead, Tr } from '../index';
import BondedAccountRow from './BondedAccountRow';
import { BondedAccountsTableProps } from './types';

const BondedAccountsTable = (
  props: BondedAccountsTableProps
): React.ReactElement => {
  const { api } = props;
  const {
    state: { allStashes },
  } = useContext(AccountsContext);

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Bonded Accounts</Th>
        </Tr>
        <Tr>
          <Th>Stash</Th>
          <Th>Controller</Th>
          <Th>Bonded Amount</Th>
        </Tr>
      </Thead>
      <Tb>
        {allStashes.length ? (
          allStashes.map((account: string) => (
            <BondedAccountRow account={account} api={api} key={account} />
          ))
        ) : (
          <Tr>
            <Tc rowSpan={4}>No Bonded Accounts</Tc>
          </Tr>
        )}
      </Tb>
    </Table>
  );
};

export default React.memo(BondedAccountsTable);
