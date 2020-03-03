// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DecoratedAccount } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { Dropdown } from '@substrate/ui-components';
import React from 'react';

interface Props {
  accounts: DecoratedAccount[];
}

export const AccountsDropdown = (props: Props) => {
  const { accounts } = props;

  if (!accounts.length) {
    return <Spinner />;
  }

  const options = accounts.map((account: DecoratedAccount) => ({
    key: account.accountId.toString(),
    text: account.accountId.toString(),
    value: account.accountId.toString(),
  }));

  return <Dropdown placeholder={'Login'} fluid selection options={options} />;
};
