// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountsList, Modal, Transition } from '@substrate/ui-components/src';
import { AccountsContext } from '@substrate/context/src';
import React, { useContext, useEffect, useState } from 'react';

export const Onboarding = () => {
  const { injectedAccounts } = useContext(AccountsContext);
  const [accounts, setAccounts] = useState<Array<InjectedAccountWithMeta>>();

  useEffect(() => {

  }, [injectedAccounts]);

  return (
    <Transition duration={500} transitionOnMount>
      <Modal dimmer>
        <AccountsList accounts={injectedAccounts} />
      </Modal>
    </Transition>
  );
}