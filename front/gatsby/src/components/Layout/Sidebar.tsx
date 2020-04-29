import { navigate } from 'gatsby';
import React, { useCallback } from 'react';
import { Icon, Menu, Sidebar } from 'semantic-ui-react';
import styled from 'styled-components';

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
    </Sidebar>
  );
};
