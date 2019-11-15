// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsList, Circle, Modal, Transition, polkadotOfficialTheme } from '@substrate/ui-components/src';
import { AccountsContext } from '@substrate/context/src';
import React, { useContext } from 'react';

export const Onboarding = () => {
  const { injectedAccounts } = useContext(AccountsContext);

  return (
    <Transition animation='pulse' duration={500} transitionOnMount visible>
      <Modal dimmer open>
        <Modal.Header>Accounts injected from @polkadot-js extension. <Circle fill={polkadotOfficialTheme.neonBlue} /></Modal.Header>
        <Modal.SubHeader>To get started, select the account you wish to use as your stash.</Modal.SubHeader>
        <Modal.Content>
          <AccountsList accounts={injectedAccounts} />
        </Modal.Content>
      </Modal>
    </Transition>
  );
}