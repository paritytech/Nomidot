// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext, getControllers } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { InputAddress } from '@substrate/ui-components';
import React, { useCallback, useContext } from 'react';

interface Props {
  onlyControllers: boolean; // filter only controllers
  width?: string;
}

const AccountsDropdown = function(props: Props): React.ReactElement {
  const { onlyControllers, width } = props;
  const {
    state: { allAccounts, currentAccount, stashControllerMap },
    dispatch,
  } = useContext(AccountsContext);

  const handleOnChangeAddress = useCallback(
    (address: string): void => {
      dispatch({
        type: 'setCurrentAccount',
        data: address,
      });
    },
    [dispatch]
  );

  if (!allAccounts || !currentAccount) {
    return <Spinner inline active />;
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
      width={width || '3rem'}
    />
  );
};

export default AccountsDropdown;
