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
  Spinner
} from '@substrate/design-system';
import {
  AddressSummary,
  Container,
  Dropdown,
  FadedText,
  StyledNavButton,
  Table,
} from '@substrate/ui-components';
import React, { useContext } from 'react';

import { toShortAddress } from '../util';
import shortid from 'shortid';

type Props = RouteComponentProps;

const AccountsList = (_props: Props): React.ReactElement => {
  const { accountBalanceMap, allAccounts, allStashes, stashControllerMap, loadingAccountStaking, loadingBalances } = useContext(AccountsContext);
  const { api } = useContext(ApiContext);

  const renderStakingQueryColumns = (account: InjectedAccountWithMeta) => {
    const staking = stashControllerMap[account.address];
    let isBonded = true;

    if (!staking) {
      isBonded = false;
    }

    return (
      <>
        {
          loadingAccountStaking
          ? <Table.Cell><Spinner active inline /></Table.Cell>
          : (
            <>
              <Table.Cell>
                {
                  isBonded
                    ? <AddressSummary
                        address={staking.controllerId?.toHuman()}
                        api={api}
                        noBalance
                        size='tiny'
                      />
                    : 'Not Bonded'
                }
              </Table.Cell>
              <Table.Cell>
                {
                  staking?.exposure?.own.toHuman() || 'Not Bonded'
                }
              </Table.Cell>
            </>
          )
        }
      </>
    );
  }
 
  const renderStashColumn = (account: InjectedAccountWithMeta) => {
    const isThisStash = allStashes.includes(account.address);

    return (
      <Table.Cell>
        {
          loadingAccountStaking
            ? <Spinner active inline />
            : isThisStash
                ? <AddressSummary
                    address={account.address}
                    api={api}
                    name={account.meta.name}
                    noBalance
                    size='tiny'
                  />
                : ''
        }
      </Table.Cell>
    )
  }

  const renderActions = (account: InjectedAccountWithMeta) => {
    return (
      <Table.Cell>
        <Dropdown text='Actions'>
          <Dropdown.Menu>
            <Dropdown.Item text='New Stake' />
            <Dropdown.Item text='Set Controller' />
            <Dropdown.Item text='Bond More Funds' />
            <Dropdown.Item text='Change Preferences' />
            <Dropdown.Item text='Create Backup' />
          </Dropdown.Menu>
        </Dropdown>
      </Table.Cell>
    )
  }

  const renderRow = (account: InjectedAccountWithMeta): React.ReactElement => {

    return (
      <Table.Row key={shortid.generate()}>
        {renderStashColumn(account)}
        {renderStakingQueryColumns(account)}
        <Table.Cell>
          {
            loadingBalances
              ? <Spinner active inline />
              : accountBalanceMap[account.address]?.reservedBalance.toHuman()
          }
        </Table.Cell>
        <Table.Cell>
          {
            loadingBalances
              ? <Spinner active inline />
              : accountBalanceMap[account.address]?.freeBalance?.toHuman()
          }
        </Table.Cell>
        {renderActions(account)}
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
            <Table.HeaderCell>Reserved Balance</Table.HeaderCell>
            <Table.HeaderCell>Transferable</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
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
