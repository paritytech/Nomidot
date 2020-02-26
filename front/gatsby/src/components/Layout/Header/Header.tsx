// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext } from '@substrate/context';
import { Button, MainMenu } from '@substrate/design-system';
import { AddressSummary, Container, Icon, StackedHorizontal } from '@substrate/ui-components';
import { navigate } from 'gatsby';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import shortid from 'shortid';

import { BlockHeader, EraHeader, SessionHeader, StakingHeader } from './Subheaders';
import { APP_TITLE } from '../../../util';

export function Header(): React.ReactElement {
  const { accounts, fetchAccounts } = useContext(AccountsContext);
  const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);

  const handleLogin = useCallback(async () => {
    try {
      await fetchAccounts();
    } catch (error) {
      window.alert(error.message);
    }
  }, [fetchAccounts]);

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <>
      <MainMenu
        contentLeft={<h2>{APP_TITLE}</h2>}
        contentRight={
          <StackedHorizontal>
            {accounts.length ? (
              <div>
                <AddressSummary
                  address={accounts[0].address}
                  name={accounts[0].meta.name}
                  noBalance
                  size='small'
                />
              </div>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
            <Icon inverted name='cart' size='large'>{numberOfItemsInCart}</Icon>
          </StackedHorizontal>
        }
        tabs={[
          <Button
            key={shortid.generate()} // FIXME: why do i need a key here...
            onClick={() => {
              navigate(`AccountsList`);
            }}
          >
            Accounts
          </Button>,
          <Button
            key={shortid.generate()} // FIXME: why do i need a key here
            onClick={() => {
              navigate(`validators`);
            }}
          >
            Validators
          </Button>,
        ]}
      />
      <Container style={{ display: 'flex' }}>
        <BlockHeader />
        <EraHeader />
        <SessionHeader />
        <StakingHeader />
      </Container>
    </>
  );
}
