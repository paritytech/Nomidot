// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Link, RouteComponentProps } from '@reach/router';
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

import { AccountsDropdown } from '../AccountsDropdown';
import { APP_TITLE, getCartItemsCount } from '../../../util';
import {
  BlockHeader,
  EraHeader,
  SessionHeader,
  StakingHeader,
} from './Subheaders';

type Props = RouteComponentProps;

export function Header(_props: Props): React.ReactElement {
  const { decoratedAccounts } = useContext(AccountsContext);
  const [numberOfItemsInCart, setNumberOfItemsInCart] = useState(0);

  useEffect(() => {
    const count = getCartItemsCount();
    setNumberOfItemsInCart(count);
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
            <AccountsDropdown accounts={decoratedAccounts} />
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
          >
            <Link to={`/accounts`}>Accounts</Link>
          </Button>,
          <Button
            key={shortid.generate()} // FIXME: why do i need a key here>
          >
            <Link to={'/validators'}>Validators</Link>
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
