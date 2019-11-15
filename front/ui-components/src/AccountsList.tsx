// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountExt } from '@substrate/context/src';
import React from 'react';
import List from 'semantic-ui-react/dist/commonjs/elements/List/List';

import { AddressSummary, Card } from './index';
import { FadedText } from './Shared.styles';

type Props = {
  accounts?: InjectedAccountExt[]
}

export function AccountsList(props: Props) {
  const { accounts } = props;

  const renderAccountsListItem = () => {
    return (
      <List>
        {
          accounts!.map((account: InjectedAccountExt) => {
            const { address, meta: { name, source } } = account;

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

  return (
    <Card>
      <Card.Content>
        {
          accounts
            ? renderAccountsListItem()
            : renderEmpty()
        }
      </Card.Content>
    </Card>
  );
}