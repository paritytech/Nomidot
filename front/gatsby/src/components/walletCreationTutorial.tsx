// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { web3Enable } from '@polkadot/extension-dapp';
import {
  Breadcrumbs,
  Image,
  Modal,
  NavButton,
  Stacked,
  StackedHorizontal,
  StyledLinkButton,
  WithSpaceAround,
} from '@substrate/ui-components/src';
import { navigate } from 'gatsby';
import React, { useState } from 'react';

const WalletCreationTutorial = (): React.ReactElement => {
  const TUTORIAL_STEPS = [
    'Commitment',
    'Keeping Your Funds',
    'Mnemonic Phrase',
    'Stash vs. Controller',
  ];

  const TUTORIAL_STEP_TEXTS = [
    'Nomidot is committed to providing you with the best and safest experience on Polkadot. To do that we ask you to take a minute to read through some basic guidelines on how to use our wallet.',
    `For security reasons, we do not store any keys. We recommend you use the @polkadotJS extension for creating or restoring any accounts. You can find it on the ${(
      <a
        target='_blank'
        rel='noopener noreferrer'
        href={
          'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd'
        }
      >
        Chrome Web Store
      </a>
    )} as well as in ${(
      <a
        target='_blank'
        rel='noopener noreferrer'
        href={
          'https://addons.mozilla.org/en-US/firefox/addon/polkadot-js-extension/'
        }
      >
        Firefox Addons
      </a>
    )} `,
    'Mnemonic Phrase',
    'To keep your funds as safe as possible, it is highly encouraged that you keep two separate accounts: a Stash and a Controller. The basic distinction can be thought of as, a Savings and Checking account. Keep most of your funds on your Stash, and use your Controller for daily activities such as paying transaction fees or nominating a new set of validators.',
  ];

  // FIXME: once I get graphics from zsofia
  const TUTORIAL_STEP_IMGS: Array<object> = [
    // commitmentPng,
    // fundsPng,
    // mnemonicPng,
    // accountsPng
  ];

  const [step, setStep] = useState(0);

  const handleNext = async (): Promise<void> => {
    if (step >= 0 && step < 4) {
      setStep(step + 1);
    } else {
      await web3Enable('nomidot');
      navigate('/accountSelection');
    }
  };

  const skipWalletCreationTutorial = (): void => {
    localStorage.setItem('isOnboarded', 'true');
    window.location.reload();
  };

  const renderTutorialStep = (): React.ReactElement => {
    return (
      <Stacked justifyContent='space-around'>
        <StackedHorizontal justifyContent='space-around'>
          <Image
            src={TUTORIAL_STEP_IMGS[step]}
            alt={TUTORIAL_STEP_TEXTS[step]}
            size='medium'
          />
          {TUTORIAL_STEP_TEXTS[step]}
        </StackedHorizontal>

        <WithSpaceAround>
          <StackedHorizontal justifyContent='space-around'>
            <StyledLinkButton onClick={skipWalletCreationTutorial}>
              Skip (Not Recommended)
            </StyledLinkButton>
            <NavButton onClick={handleNext}>Next</NavButton>
          </StackedHorizontal>
        </WithSpaceAround>
      </Stacked>
    );
  };

  return (
    <Modal centered dimmer open>
      <Modal.Header>Wallet Creation Tutorial</Modal.Header>
      <Breadcrumbs
        activeStep={TUTORIAL_STEPS[step]}
        sectionLabels={TUTORIAL_STEPS}
        size='small'
      />
      <Modal.Content>{renderTutorialStep()}</Modal.Content>
    </Modal>
  );
};

export default WalletCreationTutorial;
