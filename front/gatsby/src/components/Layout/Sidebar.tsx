import { navigate } from 'gatsby';
import React from 'react';
import { Icon, Menu, Sidebar } from 'semantic-ui-react';
import styled from 'styled-components';

import {
  BlockHeader,
  EraHeader,
  SessionHeader,
  StakingHeader,
} from './Header/Subheaders';

const CloseIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`;

interface Props {
  handleToggle: () => void;
  visible: boolean;
}

export const VerticalSidebar = ({ handleToggle, visible }: Props) => {
  const handleNavigation = (path: string) => {
    handleToggle();
    navigate(path);
  };

  return (
    <Sidebar
      as={Menu}
      animation='scale down'
      direction='left'
      icon='labeled'
      vertical
      visible={visible}
      width='wide'
    >
      <Menu.Item>
        <CloseIcon name='close' onClick={handleToggle} />
      </Menu.Item>

      <Menu.Item as='a' onClick={() => handleNavigation('/accounts')}>
        <Icon name='address book' />
        Accounts
      </Menu.Item>
      <Menu.Item as='a' onClick={() => handleNavigation('/validators')}>
        <Icon name='industry' />
        Validators
      </Menu.Item>
      <Menu.Item as='a' onClick={() => handleNavigation('/cart')}>
        <Icon name='cart' />
        Cart
      </Menu.Item>

      <Menu.Item>
        <BlockHeader />
        <EraHeader />
        <SessionHeader />
        <StakingHeader />
      </Menu.Item>
    </Sidebar>
  );
};
