// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { List, Modal } from '@substrate/ui-components';
import React, { useState } from 'react';
import styled from 'styled-components';
import media from 'styled-media-query';

import { AccountsDropdown } from './AccountsDropdown';

const ContentArea = styled.div`
  flex: 1;
  display: flex column;
  justify-content: flex-start;
  align-items: flex-start;
`

const ModalSubHeader = styled.p`
  color: #c0c0c0;
  font-weight: 300;
  font-size: 16px;
  font-family: code sans-serif;
`

export const NominationDetails = (_props: any): React.ReactElement => {
  return (
    <ContentArea>
    <div>
      <List>
        <List.Header><ModalSubHeader>Summary: </ModalSubHeader></List.Header>
        Nominate as: <AccountsDropdown />
        <List.Item>
          Nomination Period: {} eras
        </List.Item>
        <List.Item>
          Nomination Amount: {} KSM
        </List.Item>
        <List.Item>
          {16} Validators: 
        </List.Item>
      </List>
    </div>

    <div>
      <ModalSubHeader>Estimated Rewards: </ModalSubHeader>
    </div>
  </ContentArea>
  );
};
