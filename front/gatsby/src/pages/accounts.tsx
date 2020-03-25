// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  InjectedAccountWithMeta
} from '@polkadot/extension-inject/types';
import { RouteComponentProps } from '@reach/router';
import {
  AccountsContext,
  ApiContext
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

const AccountsList = (_props: Props): React.ReactElement => {
  const { allAccounts, allControllers, allStashes } = useContext(AccountsContext);
  const { api } = useContext(ApiContext);

  console.log(allAccounts);

  const renderControllerColumn = (account: InjectedAccountWithMeta) => {
    return (
      <Table.Cell>
        <FadedText>
          {toShortAddress(account.address)}
        </FadedText>
      </Table.Cell>
    )
  }

  const renderStashColumn = (account: InjectedAccountWithMeta) => {
    return (
      <Table.Cell>
        <AddressSummary
          address={account.address}
          api={api}
          name={account.meta.name}
          noBalance
          size='tiny'
        />
      </Table.Cell>
    )
  }

  const renderRow = (account: InjectedAccountWithMeta): React.ReactElement => {

    return (
      <Table.Row>
        {renderStashColumn(account)}
        {renderControllerColumn(account)}
        <Table.Cell>
          <FadedText>

          </FadedText>
        </Table.Cell>
        <Table.Cell>
        </Table.Cell>
        <Table.Cell>
        </Table.Cell>
        <Table.Cell>
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
          {allAccounts.map((account: InjectedAccountWithMeta) =>
            renderRow(account)
          )}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default AccountsList;
