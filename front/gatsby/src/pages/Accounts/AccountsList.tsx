// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  InjectedAccountWithMeta
} from '@polkadot/extension-inject/types';
import { AccountsContext, ApiContext } from '@substrate/context';
import { Table, FadedText } from '@substrate/ui-components';
import React, { useContext } from 'react';

export const AccountsList = () => {
  const { accounts } = useContext(AccountsContext);
  const { api } = useContext(ApiContext);

  const renderRow = (account: InjectedAccountWithMeta) => {
    return (
      <Table.Row>
        <Table.Cell><FadedText>{account.address}</FadedText></Table.Cell>
        <Table.Cell></Table.Cell>
      </Table.Row>
    )
  }

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
        {
          accounts.map((account: InjectedAccountWithMeta) => {
            return renderRow(account);
          })
        }
      </Table.Body>
    </Table>
  )
}