// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import React from 'react';
import List from 'semantic-ui-react/dist/commonjs/elements/List/List';

import { AddressSummary, Card } from './index';
import { FadedText } from './Shared.styles';
import { KeyringPair$Json } from '@polkadot/keyring/types';

type Props = {
  accounts?: Array<string | InjectedAccountWithMeta>
}

export function AccountsList(props: Props) {
  const { accounts } = props;

  const renderAccountsFromAddressString = () => {
    return (
      <List>
        {
          accounts!.map((address) => {
            <List.Content>
              <AddressSummary address={address.toString()} orientation='horizontal' size='small' />
            </List.Content>
          })
        }
      </List>
    )
  }

  const renderEmpty = () => {
    return (
      <FadedText>
        Hmmm...nothing to see here.
      </FadedText>
    )
  }

  if (accounts && accounts.length > 0) {
    
    return renderAccountsFromAddressString();
  }


  return (
    <Card>
      <Card.Content>
        {
          renderEmpty()
        }
      </Card.Content>
    </Card>
  );
}