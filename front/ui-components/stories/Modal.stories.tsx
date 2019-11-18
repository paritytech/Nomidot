// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean, select, text, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import { withTheme } from './customDecorators';
import { Container, Icon, Modal, Transition } from '../src';

storiesOf('Modal', module)
  .addDecorator(withKnobs)
  .addDecorator(withTheme)
  .add('with transition', () => (
    <Container>
      <Transition animation='slide up' duration={500} transitionOnMount visible>
        <Modal dimmer open>
          <Modal.Header>This is a header</Modal.Header>
          <Modal.SubHeader>This is a subheader</Modal.SubHeader>
          <Modal.Content>
            This is my content: <Icon name='blind' />
          </Modal.Content>
        </Modal>
      </Transition>
    </Container>
  ))