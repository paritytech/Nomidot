// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountExt } from '@substrate/context/src';
import React from 'react';
import List from 'semantic-ui-react/dist/commonjs/elements/List/List';

import { AddressSummary, Card, Container } from './index';
import { FadedText } from './Shared.styles';

type Props = {
  accounts: InjectedAccountExt[];
  exclude?: string[]; // optional address(es) to exclude from display
  onSelectAccount?: (
    event: React.MouseEvent<HTMLElement>,
    data: object
  ) => void;
};

export function AccountsList(props: Props): React.ReactElement {
  const { accounts, exclude, onSelectAccount } = props;

  const renderAccountsListItem = (): React.ReactElement => {
    const accountsExcludingFilter = exclude
      ? accounts.filter(accountExt => !exclude.includes(accountExt.address))
      : accounts;

    return (
      <List animated>
        {accountsExcludingFilter.map((account: InjectedAccountExt) => {
          const {
            address,
            meta: { name, source },
          } = account;

          return (
            <List.Item
              key={address}
              onClick={onSelectAccount}
              data-address={address}
            >
              <List.Content>
                <Card height='100%'>
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
