// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountsList, Modal, Transition } from '@substrate/ui-components/src';
import { AppContext } from '@substrate/context/src';
import React, { useContext, useEffect, useState } from 'react';

export const Onboarding = () => {
  const { accountsExt } = useContext(AppContext);
  const [accounts, setAccounts] = useState<Array<InjectedAccountWithMeta>>();

  useEffect(() => {

  }, [accountsExt]);

  return (
    <Transition duration={500} transitionOnMount>
      <Modal dimmer>
        <AccountsList accounts={accounts} />
      </Modal>
    </Transition>
  );
}