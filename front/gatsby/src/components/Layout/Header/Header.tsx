// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router'
import { AccountsContext } from '@substrate/context';;
import { useLocalStorage } from '@substrate/local-storage';
import { Icon, polkadotOfficialTheme } from '@substrate/ui-components';
import { Link, navigate } from 'gatsby';
import React, { useContext } from 'react';
import styled from 'styled-components';
import media from 'styled-media-query';

import { APP_TITLE } from '../../../util';
import { BlockHeader } from './Subheaders';

type Props = RouteComponentProps;

const ResponsiveMenu = styled.div`
  display: flex column !important;
`;

const PrimaryMenu = styled.div`
  display: flex !important;
  justify-content: center !important;
  align-items: center;
  width: 100%;
  height: 5rem;
  padding: 50px;
  background: black;
  color: white;
`

const SecondaryMenu = styled.div`
  display: flex !important;
  justify-content: flex-end !important;
  align-items: center;
  width: 100%;
  height: 2rem;
  padding: 15px;
  background: ${polkadotOfficialTheme.hotPink};
  color: white;
`

const NavLink = styled(Link)`
  color: white;
  flex: 1 1 auto;
  margin: 0 12px;
`;

const LinkArea = styled.div`
  margin: 0 45rem 0 0;
`;

const CartIcon = styled.div`
  color: white;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
`;

const Logo = styled.h2`
  flex: 1 1 auto;
  color: white;
  padding: 0 10px;
  margin: 0 10px 0 0;

  &:hover {
    cursor: pointer;
  }

  ${media.lessThan('medium')`
    margin-right: 13rem;
  `}

  ${media.lessThan('small')`
    margin-right: 3rem;
  `}
`;

const BlockCounter = styled(BlockHeader)`
  flex: 2 1 auto;
`;

const ExtensionStatus = styled.p`
  color: white;
`

const ExtensionNotificationArea = styled.span`
  flex: 4 1 auto
  padding: 0 15px
  width: 100px;
  margin: 0 4rem 0 0;
`

export default function Header(_props: Props): React.ReactElement {
  const { state: { extensionNotFound } } = useContext(AccountsContext);
  const [cartItemsCount] = useLocalStorage('cartItemsCount');

  const navToAccountsPage = (): void => {
    navigate('/accounts');
  };

  const navToCartPage = (): void => {
    navigate('/cart');
  };

  return (
    <ResponsiveMenu>
      <PrimaryMenu>
        <Logo onClick={navToAccountsPage}>{APP_TITLE}</Logo>
        <LinkArea>
          <NavLink to='/accounts'>Accounts</NavLink>
          <NavLink to='/validators'>Validators</NavLink>
        </LinkArea>
        <BlockCounter />
        <CartIcon>
          <Icon link name='cart' size='large' onClick={navToCartPage} />
          {cartItemsCount}
        </CartIcon>
      </PrimaryMenu>
        {
            extensionNotFound
              && <SecondaryMenu><ExtensionStatus>Extension not found. Please download <a href='https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'>Polkadot.js Extension</a>to use Nomi</ExtensionStatus></SecondaryMenu>
        }
    </ResponsiveMenu>
  );
}
