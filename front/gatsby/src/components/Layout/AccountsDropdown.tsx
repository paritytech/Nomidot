// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from '@polkadot/extension-inject/types';
import { AccountsContext } from '@substrate/context';
import { Button, Spinner } from '@substrate/design-system';
import { InputAddress } from '@substrate/ui-components';
import React, { useContext, useEffect } from 'react';

export const AccountsDropdown = () => {
  const { accounts, currentAccount, fetchAccounts, isExtensionReady, setCurrentAccount } = useContext(AccountsContext);

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (!currentAccount) {
    return <Button onClick={fetchAccounts}>Login</Button>;
  }

  return <InputAddress 
            accounts={accounts}
            onChangeAddress={setCurrentAccount}
            value={currentAccount} />
};
