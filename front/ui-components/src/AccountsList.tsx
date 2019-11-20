// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountExt } from '@substrate/context/src';
import React from 'react';
import List from 'semantic-ui-react/dist/commonjs/elements/List/List';

import { AddressSummary, Card, Container } from './index';
import { FadedText } from './Shared.styles';

type Props = {
  accounts: InjectedAccountExt[];
  clickable: boolean;
  exclude?: string[]; // optional address(es) to exclude from display
  onSelectAccount?: (
    event: React.MouseEvent<HTMLElement>,
    data: object
  ) => void;
};

export function AccountsList(props: Props): React.ReactElement {
  const { accounts, clickable, exclude, onSelectAccount } = props;

  const renderAccountsListItem = (): React.ReactElement => {
    const accountsExcludingFilter = exclude
      ? accounts.filter(accountExt => !exclude.includes(accountExt.address))
      : accounts;

    return (
      <Container>
        <List animated verticalAlign='top'>
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
                <Card clickable={clickable} height='6rem'>
                  <Card.Content>
                    <AddressSummary
                      address={address}
                      alignItems='flex-start'
                      justifyContent='space-between'
                      orientation='horizontal'
                      size='small'
                      source={source}
                      name={name}
                      withShortAddress
                    />
                  </Card.Content>
                </Card>
              </List.Item>
            );
          })}
        </List>
      </Container>
    );
  };

  const renderEmpty = (): React.ReactElement => {
    return <FadedText>Hmmm...nothing to see here.</FadedText>;
  };

  return <>{accounts ? renderAccountsListItem() : renderEmpty()}</>;
}
