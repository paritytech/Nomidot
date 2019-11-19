// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext, InjectedAccountExt, StakingContext } from '@substrate/context/src';
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
  theme,
  Transition,
  WithSpaceAround
} from '@substrate/ui-components/src';
import React, { useContext, useEffect, useState } from 'react';

export const Onboarding = (): React.ReactElement => {
  // contexts
  const { injectedAccounts } = useContext(AccountsContext);
  const { onlyBondedAccounts } = useContext(StakingContext);
  // states
  const [isComponentMounted, setIsComponentMounted] = useState<boolean>(false);
  const [step, setStep] = useState<number>(1);
  const [stash, setStash] = useState<InjectedAccountExt>();
  const [controller, setController] = useState<InjectedAccountExt>();
  const [exclude, setExclude] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setIsComponentMounted(true);
  }, []);

  useEffect(() => {
    if (stash && controller && stash === controller) {
      setErrors([...errors, 'Stash cannot be the same as controller.']);
    }
    
    if (stash && checkIfBonded(stash.address)) {
      setErrors([...errors, 'Stash is already bonded to another controller.'])
    }
    
    if (controller && checkIfBonded(controller.address)) {
      setErrors([...errors, 'Controller is already bonded from another controller.'])
    }
  }, [stash, controller]);

  const checkIfBonded = (address: string) => {
    return !!onlyBondedAccounts[address];
  }

  const goBack = () => {
    setStep(step - 1);
    setExclude([]);
  }

  const handleConfirmation = () => {
    if (stash && controller) {
      // set roles in meta
      localStorage.setItem(stash.address, 'stash');
      localStorage.setItem(controller.address, 'controller');
    }
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
      return;
    }

    if (step === 1) {
      setStash(injectedAccounts.find(account => account.address === address));
    } else if (step === 2) {
      setController(injectedAccounts.find(account => account.address === address));
    }
    
    if (!errors.length) {
      debugger;
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
      <>
        <Margin top='massive' />
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
          {step === 3 && renderConfirmMessage()}
        </Modal.SubHeader>
      </>
    );
  };

  const renderConfirmMessage = () => {
    return (
      <WithSpaceAround>
        <Stacked>
          <Modal.SubHeader>
            <DynamicSizeText fontSize='medium' fontWeight='500'>Confirm details and get staking!</DynamicSizeText>
          </Modal.SubHeader>
          <Margin top='large' />
          <NavButton onClick={handleConfirmation}>Get Started!</NavButton>
        </Stacked>
      </WithSpaceAround>
    )
  }

  const renderErrors = () => {
    return errors.map(msg => <ErrorText>{msg}</ErrorText>)
  }

  const renderModalContent = () => {
    return (
      <Modal.Content padding='2rem 3rem'>
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
    )
  }

  const renderModalHeader = () => {
    return (
      <Modal.Header justifyContent='flex-start'>
        {step > 1 && <Icon color={theme.neonBlue} name='arrow left' onClick={goBack} />}
        <Margin left />
        Nominator Profile Creation Walkthrough
        <Margin left />
      </Modal.Header>
    )
  }

  const renderModalSubheader = () => {
    if (step === 1) {
      return renderSelectStashMessage();
    } else if (step === 2) {
      return renderSelectControllerMessage()
    }
  }

  return (
    <Transition animation='slide up' duration={500} visible={isComponentMounted}>
      <Modal centered dimmer open>
        {renderModalHeader()}
        { step < 3 && renderSelectedAccountsHeader()}
        {renderModalSubheader()}
        {renderModalContent()}
        {renderErrors()}
      </Modal>
    </Transition>
  );
};
