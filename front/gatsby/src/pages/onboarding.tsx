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
  Image,
  Margin,
  Modal,
  NavButton,
  NavHeader,
  Stacked,
  StackedHorizontal,
  StyledLinkButton,
  theme,
  Transition,
  WithSpaceAround
} from '@substrate/ui-components/src';
import { navigate } from 'gatsby';
import React, { useContext, useEffect, useState } from 'react';

import extensionCreateGif from '../images/extension_create.gif';

const Onboarding = (): React.ReactElement => {
  const { isWeb3Injected } = useContext(AccountsContext);
  const [isComponentMounted, setIsComponentMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsComponentMounted(true);
  }, []);

  return (
    <Transition animation='slide up' duration={500} visible={isComponentMounted}>
      {
        isWeb3Injected
          ? <ProfileCreationWalkthrough />
          : <WalletCreationTutorial />
      }
    </Transition>
  );
};

const ProfileCreationWalkthrough = (): React.ReactElement => {
  // contexts
  const { injectedAccounts } = useContext(AccountsContext);
  const { onlyBondedAccounts } = useContext(StakingContext);
  // states
  const [step, setStep] = useState<number>(1);
  const [stash, setStash] = useState<InjectedAccountExt>();
  const [controller, setController] = useState<InjectedAccountExt>();
  const [exclude, setExclude] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  /*
  * -------------------- React Lifecycle Methods ---------------------
  */
  

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

  /*
  * -------------------- Event Handlers ---------------------
  */

  const handleConfirmation = () => {
    if (stash && controller) {
      // navigate to Profile page
      navigate('/profile', {
        state: {
          controller,
          stash
        }
      });
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
      setExclude([...exclude, address]);
      setStep(step + 1);
    }
  };

  const handleSkipOnboarding = () => {
    localStorage.setItem('isOnboarded', 'true');
    window.location.reload();
  }

  const handleGoBack = () => {
    setStep(step - 1);
    setExclude([]);
  }

  /*
  * --------------------- Render Subcomponents ---------------------
  */

  // Step 1.
  const renderSelectStashMessage = () => {
    return (
      <Modal.SubHeader>
        <DynamicSizeText fontSize='medium'>Your Stash Account(s) will hold the majority of your funds.</DynamicSizeText>
        <Margin top />
        <DynamicSizeText fontSize='small' fontWeight='600'>We highly encourage you to keep its private key disconnected from any network, and only use it to bond funds to your Controller Account.</DynamicSizeText>
      </Modal.SubHeader>
    );
  };

  // Step 2.
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
                    justifyContent='flex-end'
                    noBalance
                    address={stash.address}
                    name={stash.meta.name}
                    size='tiny'
                    type='stash' />
            }
            { controller
              && <AddressSummary
                    justifyContent='flex-end'
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

  // Step 3.
  const renderConfirmMessage = () => {
    return (
      <WithSpaceAround>
        <Stacked>
          <Modal.SubHeader>
            <DynamicSizeText fontSize='medium' fontWeight='500'>Let's get staking!</DynamicSizeText>
          </Modal.SubHeader>
          <Margin top='large' />
          <NavButton onClick={handleConfirmation}>Get Started!</NavButton>
        </Stacked>
      </WithSpaceAround>
    )
  }

  const renderModalHeader = () => {
    return (
      <Modal.Header justifyContent='space-between'>
        {step > 1 && <><Icon color={theme.neonBlue} name='arrow left' onClick={handleGoBack} /><Margin left /></>}
        Nominator Profile Creation Walkthrough
        <Margin left />
        {renderSkipOnboarding()}
      </Modal.Header>
    )
  }

  const renderModalSubheader = () => {
    if (!injectedAccounts.length || (exclude.length === injectedAccounts.length && step < 3)) {
      return renderNoInjectedAccounts();
    } else if (step === 1) {
      return renderSelectStashMessage();
    } else if (step === 2) {
      return renderSelectControllerMessage()
    }
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

  const renderErrors = () => {
    return errors.map(msg => <ErrorText>{msg}</ErrorText>)
  }

  const renderSkipOnboarding = (): React.ReactElement => {
    return <StyledLinkButton onClick={handleSkipOnboarding}>Skip</StyledLinkButton>;
  };

  const renderNoInjectedAccounts = (): React.ReactElement => {
    return (
      <Modal.SubHeader>
        <Stacked>
          <DynamicSizeText fontSize='large'>No More Injected Accounts Found.</DynamicSizeText>
          <Margin top />
          <DynamicSizeText fontWeight='600'>Please create or restore more from the @polkadotjs-extension to continue.</DynamicSizeText>
          <Margin top />
          <Image src={extensionCreateGif} alt='Create Account from Extension' size='medium' />
        </Stacked>
      </Modal.SubHeader>
    )
  }

  return (
    <Modal centered dimmer open>
      {renderModalHeader()}
      { step < 3 && renderSelectedAccountsHeader()}
      {renderModalSubheader()}
      {renderModalContent()}
      {renderErrors()}
    </Modal>
  )
}

const WalletCreationTutorial = (): React.ReactElement => {
  const [step, setStep] = useState(1);
  

  return (
    <Modal centered dimmer open>
      <Modal.Header>Wallet Creation Tutorial</Modal.Header>

    </Modal>
  )
}

export default Onboarding;