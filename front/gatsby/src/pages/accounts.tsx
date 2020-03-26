// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  InjectedAccountWithMeta
} from '@polkadot/extension-inject/types';
import { 
  AccountId
} from '@polkadot/types/interfaces';
import { RouteComponentProps } from '@reach/router';
import {
  AccountsContext,
  ApiContext
} from '@substrate/context';
import { 
  Spinner
} from '@substrate/design-system';
import {
  AddressSummary,
  Container,
  FadedText,
  Table,
} from '@substrate/ui-components';
import React, { useContext } from 'react';

import { toShortAddress } from '../util';
import shortid from 'shortid';

type Props = RouteComponentProps;

const AccountsList = (_props: Props): React.ReactElement => {
  const { allAccounts, stashControllerMap, loadingAccountStaking } = useContext(AccountsContext);
  const { api } = useContext(ApiContext);

  const renderControllerColumn = (account: InjectedAccountWithMeta) => {
    const controller = stashControllerMap[account.address];
    let isBonded = true;

    if (controller === account.address) {
      isBonded = false;
    }

    return (
      <Table.Cell>
        {
          loadingAccountStaking
            ? <Spinner active inline />
            : isBonded
              ? <AddressSummary
                  address={controller}
                  api={api}
                  name={account.meta.name}
                  noBalance
                  size='tiny'
                />
              : 'Not Bonded'
        }
      </Table.Cell>
    );
  }

  const renderStashColumn = (account: InjectedAccountWithMeta) => {

    return (
      <Table.Cell>
        {
          loadingAccountStaking
            ? <Spinner active inline />
            : <AddressSummary
                  address={stashControllerMap[account.address]}
                  api={api}
                  name={account.meta.name}
                  noBalance
                  size='tiny'
                />
        }
      </Table.Cell>
    )
  }

  const renderRow = (account: InjectedAccountWithMeta): React.ReactElement => {

    return (
      <Table.Row key={shortid.generate()}>
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
