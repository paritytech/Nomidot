// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext, DecoratedAccount } from '@substrate/context';
import { Button, Spinner } from '@substrate/design-system';
import { AddressSummary, Dropdown, DropdownProps, InputAddress } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { toShortAddress } from '../../util';

interface Props {
  accounts: DecoratedAccount[];
}

export const AccountsDropdown = (props: Props) => {
  const { accounts } = props;
  const { currentAccount, fetchAccounts, isExtensionReady, setCurrentAccount } = useContext(AccountsContext);

  if (!isExtensionReady) {
    return <Button onClick={fetchAccounts}>Login</Button>;
  }

  const onSelectAccount = (event: React.SyntheticEvent<HTMLElement>, data: DropdownProps) => {
    console.log(event);
    console.log(data);
  }

  return <InputAddress />
};
