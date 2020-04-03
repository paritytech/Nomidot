import React from 'react'
import {
  Icon,
  Menu,
  Sidebar,
} from 'semantic-ui-react'
import { navigate } from 'gatsby'

interface Props {
  handleToggle: () => void;
  visible: boolean;
}

export const VerticalSidebar = ({ handleToggle, visible }: Props) => (
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
      <Icon name='close' onClick={handleToggle} />
    </Menu.Item>
    <Menu.Item as='a' onClick={() => navigate('/accounts')}>
      <Icon name='home' />
      Accounts
    </Menu.Item>
    <Menu.Item as='a' onClick={() => navigate('/validators')}>
      <Icon name='gamepad' />
      Validators
    </Menu.Item>
    <Menu.Item as='a' onClick={() => navigate('/cart')}>
      <Icon name='cart' />
      Cart
    </Menu.Item>
  </Sidebar>
)
