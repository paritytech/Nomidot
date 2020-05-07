// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { RouteComponentProps } from '@reach/router';
import { AccountsContext, ApiRxContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { List, polkadotOfficialTheme } from '@substrate/ui-components';
import React, { useContext } from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import shortid from 'shortid';
import styled from 'styled-components';
import media from 'styled-media-query';

import {
  AddressSummary,
  BondingModal,
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

const GreyedOutArea = styled.div`
  padding: 8rem;
  text-align: center;
  background: ${polkadotOfficialTheme.grey};
  height: 20rem;
  opacity: 0.5;
`;

type Props = RouteComponentProps;

const AccountsList = (_props: Props): React.ReactElement => {
  const {
    state: {
      accountBalanceMap,
      allAccounts,
      allStashes,
      extensionNotFound,
      loadingAccountStaking,
      stashControllerMap,
    },
  } = useContext(AccountsContext);
  const { api } = useContext(ApiRxContext);

  const renderStakingQueryColumns = (account: string): React.ReactElement => {
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

  const renderStashColumn = (account: string): React.ReactElement => {
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

  const renderActionsForBonded = (): React.ReactElement => {
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

  const renderBondedAccounts = (): React.ReactElement => {
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
        {extensionNotFound ? (
          <GreyedOutArea>
            {' '}
            <SubHeader>
              {' '}
              Download{' '}
              <a href='https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'>
                Polkadot.js Extension
              </a>{' '}
              to Continue
            </SubHeader>
          </GreyedOutArea>
        ) : (
          <>
            {renderBondedAccounts()}
            <BottomLeftItem>{renderUnbondedAccounts()}</BottomLeftItem>
          </>
        )}
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
