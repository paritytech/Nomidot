// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Modal } from '@substrate/ui-components';
import React from 'react';
import styled from 'styled-components';

import { Button } from '../components';

const CHROME_STORE =
  'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';

const FF_STORE =
  'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/';

const ModalContent = styled(Modal.Content)`
  display: flex !important;
  justify-content: space-around;
  align-items: center;
  padding: 5rem !important;
`;

const ExtensionNotFoundPage = (): React.ReactElement => {
  return (
    <Modal open dimmer>
      <Modal.Header>
        Extension Not Found. Install PolkadotJS Extension to Continue.
      </Modal.Header>

      <ModalContent>
        <Button size='huge' primary href={CHROME_STORE}>
          {' '}
          Chrome{' '}
        </Button>
        <Button size='huge' secondary href={FF_STORE}>
          On Firefox
        </Button>
      </ModalContent>
    </Modal>
  );
};

export default ExtensionNotFoundPage;
