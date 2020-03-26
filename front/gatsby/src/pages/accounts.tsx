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
  Header,
  StyledNavButton,
  Table,
} from '@substrate/ui-components';
import React, { useContext } from 'react';

import { toShortAddress } from '../util';
import shortid from 'shortid';

type Props = RouteComponentProps;

const BondedAccountsList = () => {

}

const UnbondedAccountsList = () => {

}


const AccountsList = (_props: Props): React.ReactElement => {
  const { accountBalanceMap, allAccounts, allStashes, stashControllerMap, loadingAccountStaking, loadingBalances } = useContext(AccountsContext);
  const { api } = useContext(ApiContext);

  const renderStakingQueryColumns = (account: string) => {
    const staking = stashControllerMap[account];
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
              <Table.Cell padded>
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
              <Table.Cell padded>
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
 
  const renderStashColumn = (account: string) => {
    const isThisStash = allStashes.includes(account);
    const thisInjectedStash = allAccounts.find(injectedAccount => {
      injectedAccount.address === account
    });

    return (
      <Table.Cell padded>
        {
          loadingAccountStaking
            ? <Spinner active inline />
            : isThisStash
                ? <AddressSummary
                    address={account}
                    api={api}
                    name={thisInjectedStash?.meta.name}
                    noBalance
                    size='tiny'
                  />
                : ''
        }
      </Table.Cell>
    )
  }

  const renderActions = (account: string) => {
    const thisInjectedAccount = allAccounts.find(injectedAccount => {
      injectedAccount.address === account
    });

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

  const renderBalanceColumns = (account: string) => {
    return (
      <>
        <Table.Cell padded>
          {
            loadingBalances
              ? <Spinner active inline />
              : accountBalanceMap[account]?.reservedBalance.toHuman()
          }
        </Table.Cell>
        <Table.Cell padded>
          {
            loadingBalances
              ? <Spinner active inline />
              : accountBalanceMap[account]?.freeBalance?.toHuman()
          }
        </Table.Cell>
      </>
    )
  }

  const renderUnbondedAccountRow = (account: InjectedAccountWithMeta): React.ReactElement => {
    return (
      <Table.Row key={shortid.generate()}>
        <Table.Cell>
          <AddressSummary
            address={account.address}
            api={api}
            name={account.meta.name}
            noBalance
            size='tiny'
          />
        </Table.Cell>
        {renderBalanceColumns(account.address)}
        {renderActions(account.address)}
      </Table.Row>
    )
  }

  const renderBondedAccountRow = (account: string): React.ReactElement => {
    return (
      <Table.Row key={shortid.generate()}>
        {renderStashColumn(account)}
        {renderStakingQueryColumns(account)}
        {renderBalanceColumns(account)}
        {renderActions(account)}
      </Table.Row>
    );
  };

  const renderBondedAccounts = () => {
    return (
      <Table padded='very'>
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
          {allStashes.map((account: string) =>
            renderBondedAccountRow(account)
          )}
        </Table.Body>
      </Table>

    )
  }

  const renderUnbondedAccounts = () => {
    return (
      <Table padded='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Account</Table.HeaderCell>
            <Table.HeaderCell>Reserved Balance</Table.HeaderCell>
            <Table.HeaderCell>Transferable</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {allAccounts.map((account: InjectedAccountWithMeta) =>
            renderUnbondedAccountRow(account)
          )}
        </Table.Body>
      </Table>

    )
  }

  return (
    <Container>
      <Header>Bonded Accounts</Header>
      {renderBondedAccounts()}

      <Header>Unbonded Accounts</Header>
      {renderUnbondedAccounts()}
    </Container>
  );
};

export default AccountsList;
