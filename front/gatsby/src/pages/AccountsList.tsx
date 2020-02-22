// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { RouteComponentProps } from '@reach/router';
import { AccountsContext } from '@substrate/context';
import { FadedText, Table } from '@substrate/ui-components';
import React, { useContext } from 'react';

type Props = RouteComponentProps;

const AccountsList = (_props: Props) => {
  const { accounts } = useContext(AccountsContext);

  const renderRow = (account: InjectedAccountWithMeta) => {
    return (
      <Table.Row>
        <Table.Cell>
          <FadedText>{account.address}</FadedText>
        </Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    );
  };

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Stash</Table.HeaderCell>
          <Table.HeaderCell>Controller</Table.HeaderCell>
          <Table.HeaderCell>Bonded Amount</Table.HeaderCell>
          <Table.HeaderCell>Total Funds</Table.HeaderCell>
          <Table.HeaderCell>Transferable</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {accounts &&
          accounts.map((account: InjectedAccountWithMeta) => {
            return renderRow(account);
          })}
      </Table.Body>
    </Table>
  );
};

export default AccountsList;
