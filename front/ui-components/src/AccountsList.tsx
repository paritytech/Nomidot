// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountExt } from '@substrate/context/src';
import React from 'react';
import List from 'semantic-ui-react/dist/commonjs/elements/List/List';

import { AddressSummary, Card, Container } from './index';
import { FadedText } from './Shared.styles';

type Props = {
  accounts?: InjectedAccountExt[];
  onSelectAccount?: () => void;
}

export function AccountsList(props: Props) {
  const { accounts, onSelectAccount } = props;

  const renderAccountsListItem = () => {
    return (
      <List>
        {
          accounts!.map((account: InjectedAccountExt) => {
            const { address, meta: { name, source } } = account;

            return (
              <List.Content>
                <Card height='100%' onClick={onSelectAccount}><Card.Content><AddressSummary address={address} alignItems='center' justifyContent='center' orientation='horizontal' size='small' name={name} withShortAddress /></Card.Content></Card>
              </List.Content>
            )
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
    <Container>
        {
          accounts
            ? renderAccountsListItem()
            : renderEmpty()
        }
    </Container>
  );
}