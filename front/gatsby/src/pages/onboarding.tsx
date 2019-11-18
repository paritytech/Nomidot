// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { AccountsContext, InjectedAccountExt } from '@substrate/context/src';
import {
  AccountsList,
  AddressSummary,
  FadedText,
  Icon,
  Margin,
  Modal,
  NavButton,
  Stacked,
  StackedHorizontal,
  Transition,
} from '@substrate/ui-components/src';
import React, { useContext, useEffect, useState } from 'react';

export const Onboarding = (props: RouteComponentProps): React.ReactElement => {
  const { injectedAccounts } = useContext(AccountsContext);
  const [step, setStep] = useState<number>(1);
  const [stash, setStash] = useState<InjectedAccountExt>();
  const [controller, setController] = useState<InjectedAccountExt>();
  const [exclude, setExclude] = useState<string[]>([]);

  useEffect(() => {
    if (step === 1 && stash && exclude.includes(stash.address)) {
      setStash(undefined);

      const newExclude = exclude.splice(exclude.indexOf(stash!.address), 1);

      setExclude(newExclude);
    } else if (step === 2 && controller && exclude.includes(controller.address)) {
      setStash(undefined);
      setController(undefined);

      let newExclude = exclude.splice(exclude.indexOf(stash!.address), 1);
      newExclude = newExclude.splice(exclude.indexOf(controller!.address), 1);

      setExclude(newExclude);
    }
  }, [step]);

  const goBackOneStep = () => {
    setStep(step - 1);
  }

  const handleSelectAccount = (
    {
      currentTarget: {
        dataset: { address },
      },
    }: React.MouseEvent<HTMLElement>
  ) => {
    if (!address) {
      console.error('No address supplied from extension!') // should never come here
    } else {
      if (step === 1) {
        setStash(injectedAccounts.find(account => account.address === address));
        setExclude([...exclude, address]);
        setStep(step + 1);
      } else if (step === 2) {
        setController(injectedAccounts.find(account => account.address === address));
        setExclude([...exclude, address]);
        setStep(step + 1);
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
          { stash 
            && <AddressSummary 
                  justifyContent='center'
                  noBalance address={stash.address}
                  name={stash.meta.name}
                  size='tiny'
                  type='stash' />
          }
          { controller
            && <AddressSummary
                  justifyContent='center'
                  name={controller.meta.name}
                  noBalance
                  address={controller.address}
                  size='tiny'
                  type='controller' /> }
        </StackedHorizontal>
      </Modal.SubHeader>
    );
  };

  const renderConfirmMessage = () => {
    return (
      <>
        <Margin top />
        <Stacked>
          <Modal.SubHeader>
            Confirm details and get staking!
          </Modal.SubHeader>
          <Margin top='large' />
          <NavButton>Get Started!</NavButton>
        </Stacked>
      </>
    )
  }

  return (
    <Transition animation='slide up' duration={500} transitionOnMount visible>
      <Modal centered dimmer open>
        <Modal.Header justifyContent='flex-start'>
          {step > 1 && <Icon name='arrow left' onClick={goBackOneStep} />}
          <Margin left />
          <FadedText>Accounts injected from @polkadot-js extension.</FadedText>
        </Modal.Header>
        { step < 3 && renderSelectedAccountsHeader() }
        {
          step === 1
            ? renderSelectStashMessage()
            : step === 2 && stash
              ? renderSelectControllerMessage()
              : step === 3 && controller
                ? renderConfirmMessage()
                : null
        }
        <Modal.Content>
          {
            step === 3
              ? renderSelectedAccountsHeader()
              : (
                <AccountsList
                  accounts={injectedAccounts}
                  exclude={exclude}
                  onSelectAccount={handleSelectAccount}
                />
              )
          }
        </Modal.Content>
      </Modal>
    </Transition>
  );
};
