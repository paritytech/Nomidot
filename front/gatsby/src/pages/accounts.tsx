// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import {
  AccountsContext,
  ApiContext,
  DecoratedAccount,
} from '@substrate/context';
import {
  AddressSummary,
  Container,
  FadedText,
  Table,
} from '@substrate/ui-components';
import React, { useContext } from 'react';

import { toShortAddress } from '../util';

type Props = RouteComponentProps;

const AccountsList = (_props: Props) => {
  const { decoratedAccounts } = useContext(AccountsContext);
  const { api } = useContext(ApiContext);

  const renderRow = (account: DecoratedAccount) => {
    return (
      <Table.Row>
        <Table.Cell>
          <AddressSummary
            address={account.address}
            api={api}
            name={account.meta.name}
            noBalance
            size='tiny'
          />
        </Table.Cell>
        <Table.Cell>
          <FadedText>
            {toShortAddress(account.stashId || account.address)}
          </FadedText>
        </Table.Cell>
        <Table.Cell>
          <FadedText>
            {toShortAddress(account.controllerId || account.address)}
          </FadedText>
        </Table.Cell>
        <Table.Cell>
          <FadedText>{account.unlocking?.toString() || 'N/A'}</FadedText>
        </Table.Cell>
        <Table.Cell>
          <FadedText>{account.redeemable?.toString() || 'N/A'}</FadedText>
        </Table.Cell>
        <Table.Cell>
          <FadedText>{account.nominateAt?.toString() || 'N/A'}</FadedText>
        </Table.Cell>
      </Table.Row>
    );
  };

  return (
    <Container>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Stash</Table.HeaderCell>
            <Table.HeaderCell>Controller</Table.HeaderCell>
            <Table.HeaderCell>Bonded Amount</Table.HeaderCell>
            <Table.HeaderCell>Total Funds</Table.HeaderCell>
            <Table.HeaderCell>Transferable</Table.HeaderCell>
            <Table.HeaderCell>Create Bond</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {decoratedAccounts &&
            decoratedAccounts.map((account: DecoratedAccount) => {
              return renderRow(account);
            })}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default AccountsList;
