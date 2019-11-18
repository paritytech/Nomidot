// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { AccountsContext } from '@substrate/context/src';
import {
  AccountsList,
  Circle,
  Modal,
  polkadotOfficialTheme,
  Transition,
} from '@substrate/ui-components/src';
import React, { useContext } from 'react';

export const Onboarding = (props: RouteComponentProps): React.ReactElement => {
  const { injectedAccounts } = useContext(AccountsContext);
  // const [stash, setStash] = useState();
  // const [controller, setController] = useState();

  return (
    <Transition animation='slide up' duration={500} transitionOnMount visible>
      <Modal centered dimmer open>
        <Modal.Header>
          Accounts injected from @polkadot-js extension.{' '}
          <Circle fill={polkadotOfficialTheme.neonBlue} />
        </Modal.Header>
        <Modal.SubHeader>
          To get started, select the account you wish to use as your stash.
        </Modal.SubHeader>
        <Modal.Content>
          <AccountsList accounts={injectedAccounts} />
        </Modal.Content>
      </Modal>
    </Transition>
  );
};
