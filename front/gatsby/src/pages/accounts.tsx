// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { RouteComponentProps } from '@reach/router';
import { AccountsContext, ApiContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { List } from '@substrate/ui-components';
import React, { useContext } from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import shortid from 'shortid';
import styled from 'styled-components';
import media from 'styled-media-query';

import {
  AddressSummary,
  BondingModal,
  Table,
  Tb,
  Tc,
  Th,
  Thead,
  Tr,
} from '../components';
import { toShortAddress } from '../util';

const AccountsPageGrid = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  padding: 3rem;
  width: 100%;

  ${media.lessThan('medium')`
    padding: 0;
    display: inline-block;
  `}
`;

const AccountsPageLeft = styled.div`
  flex: 3;
  display: flex column;
  justify-content: space-between;
  align-items: stretch;
  height: 100%;
`;

const BottomLeftItem = styled.div`
  margin-top: 5rem;
`;

const AccountsPageRight = styled.div`
  flex: 1;
  display: flex column;
  justify-content: center;
  align-items: stretch;
  height: 100%;

  ${media.lessThan('medium')`
    display: none;
  `}
`;

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
        injectedAccount.address === account &&
        !allStashes.includes(injectedAccount.address)
    );

    return (
      <>
        <Tc>
          {loadingAccountStaking ? (
            <Spinner active inline />
          ) : !staking ? (
            'no staking info'
          ) : (
            <AddressSummary
              address={
                staking.controllerId?.toHuman && staking.controllerId?.toHuman()
              }
              api={api}
              name={thisInjectedController?.meta.name}
              noBalance
              size='tiny'
            />
          )}
        </Tc>
        <Tc>
          {loadingAccountStaking ? (
            <Spinner inline active />
          ) : !staking ? (
            'no staking info'
          ) : (
            staking.stakingLedger?.active.toHuman &&
            staking.stakingLedger?.active.toHuman()
          )}
        </Tc>
      </>
    );
  };

  const renderStashColumn = (account: string) => {
    const thisInjectedStash = allAccounts.find(
      (injectedAccount: InjectedAccountWithMeta) =>
        injectedAccount.address === account
    );

    return (
      <Tc>
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
      </Tc>
    );
  };

  const renderActionsForBonded = () => {
    return (
      <Tc>
        <Dropdown text='Actions'>
          <Dropdown.Menu>
            <Dropdown.Item text='Set Controller' />
            <Dropdown.Item text='Bond More Funds' />
            <Dropdown.Item text='Change Reward Preferences' />
          </Dropdown.Menu>
        </Dropdown>
      </Tc>
    );
  };

  const renderBalanceColumns = (account: string) => {
    const thisAccount = accountBalanceMap[account];

    return (
      <>
        <Tc>
          {thisAccount && thisAccount.lockedBalance.toHuman ? (
            thisAccount.lockedBalance.toHuman()
          ) : (
            <Spinner active inline />
          )}
        </Tc>
        <Tc>
          {thisAccount && thisAccount.reservedBalance.toHuman ? (
            thisAccount.reservedBalance.toHuman()
          ) : (
            <Spinner active inline />
          )}
        </Tc>
        <Tc>
          {thisAccount && thisAccount.freeBalance.toHuman ? (
            thisAccount.freeBalance.toHuman()
          ) : (
            <Spinner active inline />
          )}
        </Tc>
      </>
    );
  };

  const renderUnbondedAccountRow = (
    account: InjectedAccountWithMeta
  ): React.ReactElement => {
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
        {renderBalanceColumns(account.address)}
      </Tr>
    );
  };

  // FIXME doesnt make sense to render balacne here because it's not clear to the user whether the balance is for the stash or the controller. Would make sense to defer that to account details page.
  const renderBondedAccountRow = (account: string): React.ReactElement => {
    return (
      <Tr key={shortid.generate()}>
        {renderStashColumn(account)}
        {renderStakingQueryColumns(account)}
        {renderActionsForBonded()}
      </Tr>
    );
  };

  const renderBondedAccounts = () => {
    return (
      <Table>
        <Thead>
          <Tr>
            <Th>Bonded Accounts</Th>
          </Tr>
          <Tr>
            <Th>Stash</Th>
            <Th>Controller</Th>
            <Th>Bonded Amount</Th>
          </Tr>
        </Thead>
        <Tb>
          {allStashes.length ? (
            allStashes.map((account: string) => renderBondedAccountRow(account))
          ) : (
            <Tr>
              <Tc rowSpan={4}>No Bonded Accounts</Tc>
            </Tr>
          )}
        </Tb>
      </Table>
    );
  };

  const renderUnbondedAccounts = () => {
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
              renderUnbondedAccountRow(account)
            )}
        </Tb>
      </Table>
    );
  };

  return (
    <AccountsPageGrid>
      <AccountsPageLeft>
        {renderBondedAccounts()}
        <BottomLeftItem>{renderUnbondedAccounts()}</BottomLeftItem>
      </AccountsPageLeft>

      <AccountsPageRight>
        <List animated celled relaxed selection>
          <List.Header>Actions</List.Header>
          <hr />
          <List.Content>
            <BondingModal />
          </List.Content>
        </List>
      </AccountsPageRight>
    </AccountsPageGrid>
  );
};

export default AccountsList;
