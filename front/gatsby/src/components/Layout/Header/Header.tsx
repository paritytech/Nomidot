// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { useLocalStorage } from '@substrate/local-storage';
import { Icon, Menu } from '@substrate/ui-components';
import { navigate } from 'gatsby';
import React, { createRef } from 'react';
import Sticky from 'semantic-ui-react/dist/commonjs/modules/Sticky';

import { APP_TITLE } from '../../../util';
import {
  BlockHeader,
  EraHeader,
  SessionHeader,
  StakingHeader,
} from './Subheaders';

interface Props extends RouteComponentProps {
  handleToggle: () => void;
}

export default function Header(props: Props): React.ReactElement {
  const { handleToggle } = props;
  const [cartItemsCount] = useLocalStorage('cartItemsCount');

  const contextRef = createRef();

  const navToCartPage = (): void => {
    navigate('/cart');
  };

  return (
    <Sticky context={contextRef}>
      <Menu stackable>
        <Menu.Item>
          <Icon name='bars' onClick={handleToggle} />
        </Menu.Item>
        <Menu.Item>
          <h2>{APP_TITLE}</h2>
        </Menu.Item>
        <Menu.Menu stackable='true' position='right'>
          <BlockHeader />
          <EraHeader />
          <SessionHeader />
          <StakingHeader />
          <Menu.Item>
            <Icon link name='cart' size='large' onClick={navToCartPage} />
            <p>{cartItemsCount}</p>
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    </Sticky>
  );
}
