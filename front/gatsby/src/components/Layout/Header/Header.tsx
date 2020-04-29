// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { useLocalStorage } from '@substrate/local-storage';
import { Icon } from '@substrate/ui-components';
import { navigate } from 'gatsby';
import React, { createRef } from 'react';
import Sticky from 'semantic-ui-react/dist/commonjs/modules/Sticky';
import styled from 'styled-components';
import media from 'styled-media-query';

import { APP_TITLE } from '../../../util';
import { BlockHeader } from './Subheaders';

interface Props extends RouteComponentProps {
  handleToggle: () => void;
}

const ResponsiveMenu = styled.div`
  display: flex !important;
  justify-content: center !important;
  align-items: center;
  width: 100%;
  height: 5rem;
  padding: 30px;
  margin-bottom: 20px;
  background: black;
  color: white;
`;

const Burger = styled(Icon)`
  color: white;
  flex: 1;
  padding: 0 10px;
  margin: 0 10px;

  &:hover {
    cursor: pointer;
  }
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
  margin: 0 55rem 0 0;

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

export default function Header(props: Props): React.ReactElement {
  const { handleToggle } = props;
  const [cartItemsCount] = useLocalStorage('cartItemsCount');

  const contextRef = createRef();

  const navToAccountsPage = (): void => {
    navigate('/accounts');
  };

  const navToCartPage = (): void => {
    navigate('/cart');
  };

  return (
    <Sticky context={contextRef}>
      <ResponsiveMenu>
        <Burger name='bars' onClick={handleToggle} />
        <Logo onClick={navToAccountsPage}>{APP_TITLE}</Logo>
        <BlockCounter />
        <CartIcon>
          <Icon link name='cart' size='large' onClick={navToCartPage} />
          {cartItemsCount}
        </CartIcon>
      </ResponsiveMenu>
    </Sticky>
  );
}
