// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountsContext, getControllers } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { InputAddress } from '@substrate/ui-components';
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ClosableTooltip, SubHeader, Text } from './index';

interface Props {
  onlyControllers: boolean; // filter only controllers
}

const AccountsDropdown = function(props: Props): React.ReactElement {
  const { onlyControllers } = props;
  const {
    state: { allAccounts, currentAccount, stashControllerMap },
    dispatch,
  } = useContext(AccountsContext);
  const [controllers, setControllers] = useState<InjectedAccountWithMeta[]>();

  useEffect(() => {
    const controls = getControllers(allAccounts, stashControllerMap);
    console.log(controls);
    setControllers(controls);
  }, [allAccounts, onlyControllers, stashControllerMap]);

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

  if (onlyControllers && !controllers) {
    return <Spinner inline active />
  }

  if (!controllers!.length) {
    return (
      <ClosableTooltip>
        <SubHeader>You need a Controller Account to submit a Nomination!</SubHeader>
        <Text>No Controller accounts found. Go to Accounts page to create an Controller.</Text>
      </ClosableTooltip>
    )
  }

  return (
    <InputAddress
      accounts={
        onlyControllers
          ? controllers
          : allAccounts
      }
      fromKeyring={false}
      onChangeAddress={handleOnChangeAddress}
      value={controllers ? controllers[0].address : currentAccount}
      width='3rem'
    />
  );
};

export default memo(AccountsDropdown);
