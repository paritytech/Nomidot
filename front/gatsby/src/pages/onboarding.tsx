// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext, InjectedAccountExt } from '@substrate/context/src';
import {
  AccountsList,
  AddressSummary,
  DynamicSizeText,
  ErrorText,
  Icon,
  Margin,
  Modal,
  NavButton,
  Stacked,
  StackedHorizontal,
  Transition
} from '@substrate/ui-components/src';
import React, { useContext, useState } from 'react';

export const Onboarding = (): React.ReactElement => {
  const { injectedAccounts } = useContext(AccountsContext);
  const [step, setStep] = useState<number>(1);
  const [stash, setStash] = useState<InjectedAccountExt>();
  const [controller, setController] = useState<InjectedAccountExt>();
  const [exclude, setExclude] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const goBackOneStep = () => {
    setStep(step - 1);
    setExclude([]);
  }

  const handleSelectAccount = (
    {
      currentTarget: {
        dataset: { address },
      },
    }: React.MouseEvent<HTMLElement>
  ) => {
    if (!address) {
      console.error('No address supplied!') // should never come here
      setErrors([...errors, 'No address supplied!']);
    } else {
      if (step === 1) {
        setStash(injectedAccounts.find(account => account.address === address));
      } else if (step === 2) {
        setController(injectedAccounts.find(account => account.address === address));
      }

      if (stash === controller) {
        setErrors([...errors, 'Stash cannot be the same as controller']);
      } else if (checkIfBonded(stash)) {
        setErrors([...errors, 'Stash is already bonded to another controller'])
      }
 
      setExclude([...exclude, address]);
      setStep(step + 1);
    }
  };

  const renderSelectStashMessage = () => {
    return (
      <Modal.SubHeader>
        <DynamicSizeText fontSize='medium'>Your Stash Account(s) will hold the majority of your funds.</DynamicSizeText>
        <Margin top />
        <DynamicSizeText fontSize='small' fontWeight='600'>We highly encourage you to keep its private key disconnected from any network, and only use it to bond funds to your Controller Account.</DynamicSizeText>
      </Modal.SubHeader>
    );
  };

  const renderSelectControllerMessage = () => {
    return (
      <Modal.SubHeader>
        <DynamicSizeText fontSize='medium'>Nice! Now choose the account you wish to use as your controller.</DynamicSizeText>

        <DynamicSizeText fontSize='small' fontWeight='600'>Your Controller Account will be for day to day needs, such as paying tx fees, and nominating new validators.</DynamicSizeText>
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

  const renderErrors = () => {
    return errors.map(msg => <ErrorText>{msg}</ErrorText>)
  }

  return (
    <Transition animation='slide up' duration={400} transitionOnMount visible>
      <Modal centered dimmer open>
        <Modal.Header justifyContent='flex-start'>
          {step > 1 && <Icon name='arrow left' onClick={goBackOneStep} />}
          <Margin left />
          Nominator Profile Creation Walkthrough
          <Margin left />
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
        <Modal.Content padding='0 4rem'>
          {
            step === 3
              ? renderSelectedAccountsHeader()
              : (
                <AccountsList
                  accounts={injectedAccounts}
                  clickable
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
