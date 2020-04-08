// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { RouteComponentProps } from '@reach/router';
import { AccountsContext, ApiContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import {
  AddressSummary,
  Container,
  Margin,
  Stacked,
  Table,
} from '@substrate/ui-components';
import React, { useContext } from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import shortid from 'shortid';

import BondingModal from '../components/BondingModal';
import { toShortAddress } from '../util';

type Props = RouteComponentProps;

const AccountsList = (_props: Props): React.ReactElement => {
  const {
    accountBalanceMap,
    allAccounts,
    allStashes,
    loadingAccountStaking,
    stashControllerMap,
  } = useContext(AccountsContext);
  const { api } = useContext(ApiContext);

  const renderStakingQueryColumns = (account: string) => {
    const staking = stashControllerMap[account];

    const thisInjectedController = allAccounts.find(
      (injectedAccount: InjectedAccountWithMeta) =>
        injectedAccount.address === account && !allStashes.includes(injectedAccount.address)
    );

    return (
      <>
        <Table.Cell padded='very'>
          {
            loadingAccountStaking
              ? <Spinner active inline />
              : !staking
                ? 'no staking info'
                : <AddressSummary
                    address={staking.controllerId?.toHuman && staking.controllerId?.toHuman()}
                    api={api}
                    name={thisInjectedController?.meta.name}
                    noBalance
                    size='tiny'
                  />
          }
        </Table.Cell>
        <Table.Cell padded='very'>
          {
            loadingAccountStaking
              ? <Spinner inline active />
              : !staking
                ? 'no staking info'
                : staking.stakingLedger?.active.toHuman && staking.stakingLedger?.active.toHuman()
          }
        </Table.Cell>
      </>
    );
  };

  const renderStashColumn = (account: string) => {
    const thisInjectedStash = allAccounts.find(
      (injectedAccount: InjectedAccountWithMeta) =>
        injectedAccount.address === account
    );

    return (
      <Table.Cell padded='very'>
        {!allStashes ? (
          <Spinner active inline />
        ) : (
          <AddressSummary
            address={account}
            api={api}
            name={thisInjectedStash?.meta.name}
            noBalance
            size='tiny'
          />
        )}
      </Table.Cell>
    );
  };

  const renderActionsForBonded = () => {
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
    );
  };

  const renderActionsForUnbonded = () => {
    return (
      <Table.Cell padded='very'>
        <Dropdown>
          <Dropdown.Menu>
            <Dropdown.Item text='Backup' />
          </Dropdown.Menu>
        </Dropdown>
      </Table.Cell>
    );
  };

  const renderBalanceColumns = (account: string) => {
    const thisAccount = accountBalanceMap[account];
    
    return (
      <>
        <Table.Cell padded='very'>
          {
            thisAccount && thisAccount.lockedBalance.toHuman
              ? thisAccount.lockedBalance.toHuman()
              : <Spinner active inline />
          }
        </Table.Cell>
        <Table.Cell padded='very'>
          {
            thisAccount && thisAccount.reservedBalance.toHuman
              ? thisAccount.reservedBalance.toHuman()
              : <Spinner active inline />
          }
        </Table.Cell>
        <Table.Cell padded='very'>
          {
            thisAccount && thisAccount.freeBalance.toHuman
             ? thisAccount.freeBalance.toHuman()
             : <Spinner active inline />
          }
        </Table.Cell>
      </>
    );
  };

  const renderUnbondedAccountRow = (
    account: InjectedAccountWithMeta
  ): React.ReactElement => {
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
        <Table.Cell padded='very'>{toShortAddress(account.address)}</Table.Cell>
        {renderBalanceColumns(account.address)}
        {renderActionsForUnbonded()}
      </Table.Row>
    );
  };

  // FIXME doesnt make sense to render balacne here because it's not clear to the user whether the balance is for the stash or the controller. Would make sense to defer that to account details page.
  const renderBondedAccountRow = (account: string): React.ReactElement => {
    return (
      <Table.Row key={shortid.generate()}>
        {renderStashColumn(account)}
        {renderStakingQueryColumns(account)}
        {renderActionsForBonded()}
      </Table.Row>
    );
  };

  const renderBondedAccounts = () => {
    return (
      <Table unstackable padded='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan='8'>Bonded</Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Stash</Table.HeaderCell>
            <Table.HeaderCell>Controller</Table.HeaderCell>
            <Table.HeaderCell>Bonded Amount</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {allStashes.length
            ? allStashes.map((account: string) =>
                renderBondedAccountRow(account)
              )
            : 'No Bonded Accounts'}
        </Table.Body>
      </Table>
    );
  };

  const renderUnbondedAccounts = () => {
    return (
      <Table unstackable padded='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan='5'>Unbonded</Table.HeaderCell>
            <Table.HeaderCell colSpan='7'>
              <BondingModal />
            </Table.HeaderCell>
          </Table.Row>
          <Table.Row>
            <Table.HeaderCell>Account</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Locked</Table.HeaderCell>
            <Table.HeaderCell>Reserved Balance</Table.HeaderCell>
            <Table.HeaderCell>Transferable</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {allAccounts
            .filter(
              (account: InjectedAccountWithMeta) =>
                !allStashes.includes(account.address)
            )
            .map((account: InjectedAccountWithMeta) =>
              renderUnbondedAccountRow(account)
            )}
        </Table.Body>
      </Table>
    );
  };

  return (
    <Container>
      <Stacked alignItems='flex-end'>{renderBondedAccounts()}</Stacked>
      <Margin top />
      <Stacked alignItems='flex-end'>{renderUnbondedAccounts()}</Stacked>
    </Container>
  );
};

export default AccountsList;
