// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { navigate } from 'gatsby';
import React, { useCallback } from 'react';
import { Icon, Menu, Sidebar } from 'semantic-ui-react';
import styled from 'styled-components';

import { EraHeader, SessionHeader, StakingHeader } from './Header/Subheaders';

const CloseIcon = styled(Icon)`
  float: left;
  margin-bottom: 30px;

  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  handleToggle: () => void;
  visible: boolean;
}

export const VerticalSidebar = ({
  handleToggle,
  visible,
}: Props): React.ReactElement => {
  const handleNavigation = useCallback(
    (path: string): void => {
      handleToggle();
      navigate(path);
    },
    [handleToggle]
  );

  return (
    <Sidebar
      as={Menu}
      animation='overlay'
      direction='left'
      icon='labeled'
      vertical
      visible={visible}
      width='wide'
    >
      <CloseIcon name='close' onClick={handleToggle} />

      <Menu.Item as='a' onClick={(): void => handleNavigation('/accounts')}>
        Accounts
      </Menu.Item>
      <Menu.Item as='a' onClick={(): void => handleNavigation('/validators')}>
        Validators
      </Menu.Item>
      <Menu.Item as='a' onClick={(): void => handleNavigation('/cart')}>
        Cart
      </Menu.Item>

      <Menu.Menu>
        <EraHeader inverted />
        <SessionHeader inverted />
        <StakingHeader inverted />
      </Menu.Menu>
    </Sidebar>
  );
};
