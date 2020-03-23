// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { Button, MainMenu } from '@substrate/design-system';
import { useLocalStorage } from '@substrate/local-storage';
import { Container, Icon, StackedHorizontal } from '@substrate/ui-components';
import { navigate } from 'gatsby';
import React from 'react';
import shortid from 'shortid';

import { APP_TITLE } from '../../../util';
import { AccountsDropdown } from '../../AccountsDropdown';
import {
  BlockHeader,
  EraHeader,
  SessionHeader,
  StakingHeader,
} from './Subheaders';

type Props = RouteComponentProps;

export default function Header(_props: Props): React.ReactElement {
  const [cartItemsCount] = useLocalStorage('cartItemsCount');

  const navToCartPage = (): void => {
    navigate('/cart');
  };

  return (
    <>
      <MainMenu
        contentLeft={<h2>{APP_TITLE}</h2>}
        contentRight={
          <StackedHorizontal justifyContent='center' alignItems='center'>
            <AccountsDropdown />
            <Icon
              inverted
              link
              name='cart'
              size='large'
              onClick={navToCartPage}
            />
            <p>{cartItemsCount}</p>
          </StackedHorizontal>
        }
        tabs={[
          <Button
            onClick={(): Promise<void> => navigate('/accounts')}
            key={shortid.generate()} // FIXME: why do i need a key here...
          >
            Accounts
          </Button>,
          <Button
            onClick={(): Promise<void> => navigate('/validators')}
            key={shortid.generate()} // FIXME: why do i need a key here>
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
