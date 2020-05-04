// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { RouteComponentProps } from '@reach/router';
import { AccountsContext, ApiRxContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { List } from '@substrate/ui-components';
import React, { useContext } from 'react';
import shortid from 'shortid';
import styled from 'styled-components';
import media from 'styled-media-query';

import {
  AddressSummary,
  BondingModal,
  BondedAccountsTable,
  ClosableTooltip,
  SubHeader,
  Table,
  Tb,
  Tc,
  Text,
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
  height: 100vh;

  ${media.lessThan('medium')`
    display: none;
  `}
`;

type Props = RouteComponentProps;

const AccountsList = (_props: Props): React.ReactElement => {
  const {
    state: {
      accountBalanceMap,
      allAccounts,
      allStashes,
      loadingAccountStaking,
      stashControllerMap,
    },
  } = useContext(AccountsContext);
  const { api } = useContext(ApiRxContext);

  const renderBalanceColumns = (account: string): React.ReactElement => {
    const thisAccount = accountBalanceMap[account];

    // all these checks are a sign something else is wrong
    return (
      <>
        <Tc>
          {thisAccount &&
          thisAccount.lockedBalance &&
          thisAccount.lockedBalance.toHuman ? (
            thisAccount.lockedBalance.toHuman()
          ) : (
            <Spinner active inline />
          )}
        </Tc>
        <Tc>
          {thisAccount &&
          thisAccount.reservedBalance &&
          thisAccount.reservedBalance.toHuman ? (
            thisAccount.reservedBalance.toHuman()
          ) : (
            <Spinner active inline />
          )}
        </Tc>
        <Tc>
          {thisAccount &&
          thisAccount.freeBalance &&
          thisAccount.freeBalance.toHuman ? (
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

  const renderUnbondedAccounts = (): React.ReactElement => {
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
        <BondedAccountsTable api={api} />
        <BottomLeftItem>{renderUnbondedAccounts()}</BottomLeftItem>
      </AccountsPageLeft>

      <AccountsPageRight>
        <ClosableTooltip>
          <SubHeader>Welcome!</SubHeader>
          <Text>
            In Kusama and Polkadot, you have two accounts that makes up a whole.
            We call them a <b>Stash</b> and a <b>Controller.</b>
          </Text>
          <Text>
            Think about this as something like a Savings and a Checking account.
          </Text>
          <Text>
            In order to begin Nominating, we require you to connect these two
            accounts. We call this process <b>creating a bond.</b>
          </Text>
          <Text>
            Get started by clicking the <b>New Bond</b> button below.
          </Text>
        </ClosableTooltip>
        <List animated celled relaxed selection>
          <List.Header>Actions</List.Header>
          <hr />
          <List.Content>
            <List.Item>
              <BondingModal />
            </List.Item>
          </List.Content>
        </List>
      </AccountsPageRight>
    </AccountsPageGrid>
  );
};

export default AccountsList;
