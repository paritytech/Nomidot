// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext, getControllers } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { InputAddress } from '@substrate/ui-components';
import React, { useContext } from 'react';

interface Props {
  onlyControllers: boolean; // filter only controllers
}

export const AccountsDropdown = (props: Props): React.ReactElement => {
  const { onlyControllers } = props;
  const {
    state: {
      allAccounts,
      currentAccount,
      stashControllerMap
    },
    dispatch
  } = useContext(AccountsContext);

  if (!allAccounts || !currentAccount) {
    return <Spinner inline />;
  }

  const handleOnChangeAddress = (address: string) => {
    dispatch({
      type: 'setCurrentAccount',
      currentAccount: address
    })
  }

  return (
    <InputAddress
      accounts={
        onlyControllers
          ? getControllers(allAccounts, stashControllerMap)
          : allAccounts
      }
      fromKeyring={false}
      onChangeAddress={handleOnChangeAddress}
      value={currentAccount}
      width='3rem'
    />
  );
};
