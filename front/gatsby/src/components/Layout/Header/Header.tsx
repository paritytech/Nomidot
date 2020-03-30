// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { useLocalStorage } from '@substrate/local-storage';
import { Icon, Menu, StackedHorizontal } from '@substrate/ui-components';
import { navigate, Link } from 'gatsby';
import React from 'react';

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
      <Menu>
        <Menu.Item>
          <h2>{APP_TITLE}</h2>
        </Menu.Item>
        <Menu.Menu>
          <Menu.Item>
            <Link to='/accounts'>
              Accounts
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to='/validators'>
            Validators
            </Link>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Menu position='right'>
            <BlockHeader />
            <EraHeader />
            <SessionHeader />
            <StakingHeader />
            <AccountsDropdown />
          <Menu.Item>
            <Icon
              link
              name='cart'
              size='large'
              onClick={navToCartPage}
            />
            <p>{cartItemsCount}</p>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </>
  );
}
