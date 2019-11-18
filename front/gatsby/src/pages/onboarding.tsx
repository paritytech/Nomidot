// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { AccountsContext } from '@substrate/context/src';
import {
  AccountsList,
  AddressSummary,
  Modal,
  StackedHorizontal,
  Transition,
} from '@substrate/ui-components/src';
import React, { useContext, useState } from 'react';

export const Onboarding = (props: RouteComponentProps): React.ReactElement => {
  const { navigate } = props;
  const { injectedAccounts } = useContext(AccountsContext);
  const [step, setStep] = useState<number>(1);
  const [stash, setStash] = useState();
  const [controller, setController] = useState();

  const handleSelectAccount = (
    {
      currentTarget: {
        dataset: { address },
      },
    }: React.MouseEvent<HTMLElement>
  ) => {
    if (step === 1) {
      setStash(address);
      setStep(2);
    } else if (step === 2) {
      setController(address);
      // navigate to validators
      if (navigate) {
        navigate('/validators');
      }
    }
  };

  const renderSelectStashMessage = () => {
    return (
      <Modal.SubHeader>
        To get started, select the account you wish to use as your stash.
      </Modal.SubHeader>
    );
  };

  const renderSelectControllerMessage = () => {
    return (
      <Modal.SubHeader>
        Nice! Now choose the account you wish to use as your controller.
      </Modal.SubHeader>
    );
  };

  const renderSelectedAccountsHeader = () => {
    return (
      <Modal.SubHeader>
        <StackedHorizontal>
          { stash && <AddressSummary justifyContent='center' noBalance address={stash} size='tiny' type='stash' /> }
          { controller && <AddressSummary justifyContent='center' noBalance address={controller} size='tiny' type='controller' /> }
        </StackedHorizontal>
      </Modal.SubHeader>
    );
  };

  return (
    <Transition animation='slide up' duration={500} transitionOnMount visible>
      <Modal centered dimmer open>
        <Modal.Header>
          Accounts injected from @polkadot-js extension.{' '}
        </Modal.Header>
        {renderSelectedAccountsHeader()}
        {step === 1
          ? renderSelectStashMessage()
          : renderSelectControllerMessage()}
        <Modal.Content>
          <AccountsList
            accounts={injectedAccounts}
            exclude={[stash]}
            onSelectAccount={handleSelectAccount}
          />
        </Modal.Content>
      </Modal>
    </Transition>
  );
};
