// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { AccountsContext } from '@substrate/context';
import { Button, MainMenu } from '@substrate/design-system';
import {
  AddressSummary,
  Container,
  Icon,
  Margin,
  StackedHorizontal,
} from '@substrate/ui-components';
import { navigate } from 'gatsby';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import shortid from 'shortid';

import { APP_TITLE, getCartItemsCount } from '../../../util';
import {
  BlockHeader,
  EraHeader,
  SessionHeader,
  StakingHeader,
} from './Subheaders';

type Props = RouteComponentProps;

export function Header(_props: Props): React.ReactElement {
  const { decoratedAccounts, fetchAccounts } = useContext(AccountsContext);

  const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);

  const handleLogin = useCallback(async () => {
    try {
      await fetchAccounts();
    } catch (error) {
      window.alert(error.message);
    }
  }, [fetchAccounts]);

  useEffect(() => {
    const count = getCartItemsCount();
    setNumberOfItemsInCart(count);
    handleLogin();

    // FIXME: use store.js for window.addEventListener('storage', updateCartItems);
  }, []);

  const navToCartPage = () => {
    navigate('/cart');
  };

  return (
    <>
      <MainMenu
        contentLeft={<h2>{APP_TITLE}</h2>}
        contentRight={
          <StackedHorizontal justifyContent='center' alignItems='center'>
            {decoratedAccounts.length ? (
              <div>
                <AddressSummary
                  address={decoratedAccounts[0].address}
                  name={decoratedAccounts[0].meta.name}
                  noBalance
                  size='tiny'
                />
              </div>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
            <Margin left='big' />
            <Icon
              inverted
              link
              name='cart'
              size='large'
              onClick={navToCartPage}
            />
            <p>{numberOfItemsInCart}</p>
          </StackedHorizontal>
        }
        tabs={[
          <Button
            key={shortid.generate()} // FIXME: why do i need a key here...
            onClick={() => {
              navigate(`/accounts`);
            }}
          >
            Accounts
          </Button>,
          <Button
            key={shortid.generate()} // FIXME: why do i need a key here
            onClick={() => {
              navigate(`/validators`);
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
