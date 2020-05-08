// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { AccountsContext, ApiRxContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { List, polkadotOfficialTheme } from '@substrate/ui-components';
import React, { useContext } from 'react';
import styled from 'styled-components';
import media from 'styled-media-query';

import {
  BondedAccountsTable,
  BondingModal,
  ClosableTooltip,
  SubHeader,
  Text,
  UnbondedAccountsTable,
} from '../components';

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
      extensionNotFound,
    },
  } = useContext(AccountsContext);
  const { api } = useContext(ApiRxContext);

  return (
    <AccountsPageGrid>
      <AccountsPageLeft>
        <BondedAccountsTable api={api} />
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
          <BottomLeftItem>
            <UnbondedAccountsTable api={api} />
          </BottomLeftItem>
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
