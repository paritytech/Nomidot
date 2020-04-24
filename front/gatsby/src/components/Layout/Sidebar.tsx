import { navigate } from 'gatsby';
import React, { useCallback } from 'react';
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
      <Menu.Item>
        <CloseIcon name='close' onClick={handleToggle} />
      </Menu.Item>

      <Menu.Item as='a' onClick={(): void => handleNavigation('/accounts')}>
        <Icon name='address book' />
        Accounts
      </Menu.Item>
      <Menu.Item as='a' onClick={(): void => handleNavigation('/validators')}>
        <Icon name='industry' />
        Validators
      </Menu.Item>
      <Menu.Item as='a' onClick={(): void => handleNavigation('/cart')}>
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
