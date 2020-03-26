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
  Header,
  Modal,
  StyledNavButton,
  Table,
} from '@substrate/ui-components';
import React, { useContext } from 'react';

import { toShortAddress } from '../util';
import shortid from 'shortid';

type Props = RouteComponentProps;

const AccountsList = (_props: Props): React.ReactElement => {
  const { accountBalanceMap, allAccounts, allStashes, stashControllerMap, loadingAccountStaking } = useContext(AccountsContext);
  const { api } = useContext(ApiContext);

  const renderStakingQueryColumns = (account: string) => {
    const staking = stashControllerMap[account];

    return (
      <>
        <Table.Cell padded='very' >
          {
            staking
              ? <AddressSummary
                  address={staking.controllerId?.toHuman()}
                  api={api}
                  noBalance
                  size='tiny'
                />
              : <Spinner />
          }
        </Table.Cell>
        <Table.Cell padded='very'>
          {
            staking?.exposure?.own.toHuman() || <Spinner inline active />
          }
        </Table.Cell>
      </>
    );
  }
 
  const renderStashColumn = (account: string) => {
    const isThisStash = allStashes.includes(account);
    const thisInjectedStash = allAccounts.find((injectedAccount: InjectedAccountWithMeta) => {
      injectedAccount.address === account
    });

    return (
      <Table.Cell padded='very'>
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

  const renderActionsForBonded = (account: string) => {
    return (
      <Table.Cell padded='very'>
        <Dropdown text='Actions'>
          <Dropdown.Menu>
            <Dropdown.Item text='Set Controller' />
            <Dropdown.Item text='Bond More Funds' />
            <Dropdown.Item text='Change Reward Preferences' />
          </Dropdown.Menu>
        </Dropdown>
      </Table.Cell>
    )
  }

  const renderBondingModal = () => {
    return (
      <Modal trigger={<>Bond as Stash</>}>
        <Modal.Header>Bonding Preferences</Modal.Header>
        <Modal.Content image>
          <Modal.Description>
            <p>
              We've found the following gravatar image associated with your e-mail
              address.
            </p>
            <p>Is it okay to use this photo?</p>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    )
  }

  const renderActionsForUnbonded = (account: string) => {
    return (
      <Table.Cell padded='very'>
        <Dropdown text='Actions'>
          <Dropdown.Menu>
            <Dropdown.Item>
              {renderBondingModal()}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Table.Cell>
    )
  }

  const renderBalanceColumns = (account: string) => {
    return (
      <>
        <Table.Cell padded='very'>
          {
            accountBalanceMap[account]?.reservedBalance.toHuman() || <Spinner active inline /> 
          }
        </Table.Cell>
        <Table.Cell padded='very'>
          {
            accountBalanceMap[account]?.freeBalance?.toHuman() || <Spinner active inline />
          }
        </Table.Cell>
      </>
    )
  }

  const renderUnbondedAccountRow = (account: InjectedAccountWithMeta): React.ReactElement => {
    return (
      <Table.Row key={shortid.generate()}>
        <Table.Cell padded='very'>
          <AddressSummary
            address={account.address}
            api={api}
            name={account.meta.name}
            noBalance
            size='tiny'
          />
        </Table.Cell>
        <Table.Cell padded='very'>
          {
            toShortAddress(account.address)
          }
        </Table.Cell>
        {renderBalanceColumns(account.address)}
        {renderActionsForUnbonded(account.address)}
      </Table.Row>
    )
  }

  const renderBondedAccountRow = (account: string): React.ReactElement => {
    return (
      <Table.Row key={shortid.generate()}>
        {renderStashColumn(account)}
        {renderStakingQueryColumns(account)}
        {renderBalanceColumns(account)}
        {renderActionsForBonded(account)}
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
          {
            allStashes.length
              ? allStashes.map((account: string) =>
                  renderBondedAccountRow(account)
                )
              : <Spinner active inline />
          }
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
            <Table.HeaderCell>Address</Table.HeaderCell>
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
