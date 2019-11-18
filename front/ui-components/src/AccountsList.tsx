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
};

export function AccountsList(props: Props): React.ReactElement {
  const { accounts, onSelectAccount } = props;

  const renderAccountsListItem = (): React.ReactElement => {
    return (
      <List>
        {accounts &&
          accounts.map((account: InjectedAccountExt) => {
            const {
              address,
              meta: { name, source },
            } = account;

            return (
              <List.Item>
                <List.Content key={address}>
                  <Card height='100%' onClick={onSelectAccount}>
                    <Card.Content>
                      <AddressSummary
                        address={address}
                        alignItems='center'
                        justifyContent='center'
                        orientation='horizontal'
                        size='small'
                        source={source}
                        name={name}
                        withShortAddress
                      />


                    </Card.Content>
                  </Card>
                </List.Content>
              </List.Item>
            );
          })}
      </List>
    );
  };

  const renderEmpty = (): React.ReactElement => {
    return <FadedText>Hmmm...nothing to see here.</FadedText>;
  };

  return (
    <Container>{accounts ? renderAccountsListItem() : renderEmpty()}</Container>
  );
}
