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

import { APP_TITLE } from '../../../util';

interface Props extends RouteComponentProps {
  handleToggle: () => void;
}

const ResponsiveMenu = styled.div`
  display: flex;
  width: 100%;
  height: 5rem;
  padding: 20px;
  marginbottom: 20px;
  background: white;
`;

const Burger = styled(Icon)`
  position: absolute;
  left: 2rem;
  top: 2rem;

  &:hover {
    cursor: pointer;
  }
`;

const CartIcon = styled.div`
  position: absolute;
  right: 2rem;
  top: 2rem;
  display: flex;
  alignitems: center;
  justifycontent: center;
  height: 50px;
  width: 50px;
`;

const Logo = styled.h2`
  position: absolute;
  left: 4rem;
  top: 1.8rem;
`;

export default function Header(props: Props): React.ReactElement {
  const { handleToggle } = props;
  const [cartItemsCount] = useLocalStorage('cartItemsCount');

  const contextRef = createRef();

  const navToCartPage = (): void => {
    navigate('/cart');
  };

  return (
    <Sticky context={contextRef}>
      <ResponsiveMenu>
        <Burger name='bars' onClick={handleToggle} />
        <Logo>{APP_TITLE}</Logo>
        <CartIcon>
          <Icon link name='cart' size='large' onClick={navToCartPage} />
          {cartItemsCount}
        </CartIcon>
      </ResponsiveMenu>
    </Sticky>
  );
}
