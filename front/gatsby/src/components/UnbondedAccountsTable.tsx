// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRx } from '@polkadot/api';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountsContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import React, { useContext } from 'react';
import shortid from 'shortid';

import {
  AddressSummary,
  Table,
  Tb,
  Tc,
  Th,
  Thead,
  Tr,
} from '../components';
import { toShortAddress } from '../util';

interface BalanceColumnsProps {
  account: string;
}

interface UnbondedAccountRowProps {
  account: InjectedAccountWithMeta;
  api: ApiRx;
}

interface UnbondedAccountsTableProps {
  api: ApiRx;
}

const BalanceColumns = React.memo((props: BalanceColumnsProps): React.ReactElement => {
  const { account } = props;
  const { state: { accountBalanceMap } } = useContext(AccountsContext);

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
});

const UnbondedAccountRow = React.memo((props: UnbondedAccountRowProps): React.ReactElement => {
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
});

const UnbondedAccountsTable = (props: UnbondedAccountsTableProps): React.ReactElement => {
  const { api } = props;
  const { state: { allAccounts, allStashes } } = useContext(AccountsContext);

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
          .map((account: InjectedAccountWithMeta) =>
            <UnbondedAccountRow account={account} api={api} key={account.address} />
          )}
      </Tb>
    </Table>
  );
};

export default React.memo(UnbondedAccountsTable);