// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext } from '@substrate/context/src';
import { AccountsList, Modal, Transition } from '@substrate/ui-components/src';
import { navigate } from 'gatsby';
import React, { useContext, useEffect, useState } from 'react';

const Onboarding = (): React.ReactElement => {
  const { injectedAccounts } = useContext(AccountsContext);
  const [isComponentMounted, setIsComponentMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsComponentMounted(true);

    return () => setIsComponentMounted(false);
  }, []);

  // TODO: save to DB not local storage
  const handleSelectAccount = ({ currentTarget: { dataset: { address } } }: React.MouseEvent<HTMLElement>) => {
    if (address) {
      localStorage.setItem('exploringAs', address);
    }
  }

  return (
    <Transition animation='slide up' duration={500} visible={isComponentMounted}>
      <Modal dimmer open>
        <Modal.Header>Select an account to start exploring.</Modal.Header>
        <Modal.Content>
          <AccountsList accounts={injectedAccounts} clickable onSelectAccount={handleSelectAccount} />
        </Modal.Content>
      </Modal>
    </Transition>
  );
};

export default Onboarding;