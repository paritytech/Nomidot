// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createType } from '@polkadot/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import {
  AccountsContext,
  ApiContext,
  ExtrinsicDetails,
  handler,
  TxQueueContext,
} from '@substrate/context';
import { Button, Spinner } from '@substrate/design-system';
import {
  BalanceDisplay,
  Dropdown,
  DropdownProps,
  ErrorText,
  Input,
  InputAddress,
  Margin,
  Modal,
  Stacked,
} from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';

import { validateFees } from '../util/validateExtrinsic';

enum RewardDestination {
  'Stash',
  'Staked',
  'Controller',
}

const rewardDestinationOptions = [
  {
    key: 'Stake',
    text: 'Stash (increase amount at stake)',
    value: 'Staked',
  },
  {
    key: 'Stash',
    text: 'Stash (do not increase amount at stake)',
    value: 'Stash',
  },
  {
    key: 'Controller',
    text: 'Controller',
    value: 'Controller',
  },
];

type Error = string;

const BondingModal = (): React.ReactElement => {
  const {
    accountBalanceMap,
    allAccounts,
    currentAccount,
    loadingBalances,
  } = useContext(AccountsContext);
  const { api, apiPromise, isApiReady } = useContext(ApiContext);
  const { enqueue, signAndSubmit, txQueue } = useContext(TxQueueContext);

  const [accountForController, setAccountForController] = useState(
    currentAccount
  );
  const [accountForStash, setAccountForStash] = useState(currentAccount);
  const [bondAmount, setBondAmount] = useState<string>('');
  const [bondingError, setBondingError] = useState<Error>();
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [rewardDestination, setRewardDestination] = useState<RewardDestination>(
    RewardDestination.Staked
  );
  const [allFees, setAllFees] = useState<BN>();
  const [allTotal, setAllTotal] = useState<BN>();
  const [txId, setTxId] = useState<number>();

  const checkFees = async () => {
    if (apiPromise && isApiReady && accountForStash && accountForController && bondAmount && extrinsic) {

      const fees = await apiPromise.derive.balances.fees();
      const accountNonce = await apiPromise.query.system.account(
        accountForStash
      );

      const [feeErrors, total, fee] = validateFees(
        accountNonce,
        new BN(bondAmount),
        accountBalanceMap[accountForStash],
        extrinsic,
        fees
      );

      setAllTotal(total);
      setAllFees(fee);

      if (feeErrors) {
        setBondingError(feeErrors[0]);
      } else {
        setBondingError(undefined);
      }
    }
  };

  const checkUserInputs = () => {
    if (!accountForStash) {
      setBondingError('Please select an account to use as your stash.');
      return;
    }

    if (!accountForController) {
      setBondingError('Please select an account to use as your controller.');
      return;
    }

    if (accountForStash === accountForController) {
      setBondingError('Please use different accounts for stash and controller');
      return;
    }

    if (!rewardDestination) {
      setBondingError('Please select a reward destination.');
      return;
    }
  };

  useEffect(() => {
    if (accountForController && api && isApiReady) {
      const submitBondExtrinsic = api.tx.staking.bond(
        accountForController,
        new BN(bondAmount),
        rewardDestination
      );

      setExtrinsic(submitBondExtrinsic)
    }
  }, [accountForController, api, isApiReady]);

  useEffect(() => {
    if (currentAccount) {
      setAccountForStash(currentAccount);
      setAccountForController(currentAccount);
    }
  }, [currentAccount]);

  useEffect(() => {
    if (apiPromise) {
      checkUserInputs();
      checkFees();
    }
  }, [
    accountForStash,
    accountForController,
    bondAmount,
    apiPromise,
    rewardDestination,
  ]);

  useEffect(() => {
    if (txId) {
      signAndSubmit(txId);
    }
  }, [txId])

  const selectStash = (address: string) => {
    setAccountForStash(address);
  };

  const selectController = (address: string) => {
    setAccountForController(address);
  };

  const handleSetRewardDestination = (
    _event: React.SyntheticEvent,
    { value }: DropdownProps
  ) => {
    setRewardDestination(value as RewardDestination);
  };

  const signAndSubmitBond = async () => {
    if (
      apiPromise &&
      accountForController &&
      accountForStash &&
      allFees &&
      allTotal &&
      extrinsic
    ) {
      const details: ExtrinsicDetails = {
        allFees,
        allTotal,
        amount: createType(api.registry, 'Balance', bondAmount),
        methodCall: 'staking.bond',
        senderPair: accountForStash,
      };

      const id = enqueue(extrinsic, details);
      setTxId(id);
    }
  };

  return (
    <Modal closeIcon dimmer trigger={<Button>New Bond</Button>}>
      <Modal.Header>Bonding Preferences</Modal.Header>
      <Modal.Content>
        <Stacked alignItems='stretch' justifyContent='space-between'>
              <b>Choose Stash:</b>
              {accountForStash ? (
                <>
                  <InputAddress
                    accounts={allAccounts}
                    fromKeyring={false}
                    onChangeAddress={selectStash}
                    value={accountForStash}
                    width='175px'
                  />
                  {loadingBalances ? (
                    <Spinner active inline />
                  ) : (
                    <BalanceDisplay
                      allBalances={accountBalanceMap[accountForStash]}
                    />
                  )}
                </>
              ) : (
                <Spinner active inline />
              )}
              <b>Choose Controller:</b>
              {accountForController ? (
                <>
                  <InputAddress
                    accounts={allAccounts}
                    fromKeyring={false}
                    onChangeAddress={selectController}
                    value={accountForController}
                    width='175px'
                  />
                  {loadingBalances ? (
                    <Spinner active inline />
                  ) : (
                    <BalanceDisplay
                      allBalances={accountBalanceMap[accountForController]}
                    />
                  )}
                </>
              ) : (
                <Spinner active inline />
              )}
          <Margin top />
            <Dropdown
              fluid
              placeholder='Reward Destination'
              selection
              onChange={handleSetRewardDestination}
              options={rewardDestinationOptions}
            />
            <Margin top />
            <Input
              fluid
              label='UNIT'
              labelPosition='right'
              min={0}
              onChange={handler(setBondAmount)}
              placeholder='e.g. 1.00'
              type='number'
              value={bondAmount}
            />
          <Modal.Description>
            <Button onClick={signAndSubmitBond}>Submit Bond</Button>
            <ErrorText>{bondingError}</ErrorText>
          </Modal.Description>
        </Stacked>
      </Modal.Content>
    </Modal>
  );
};

export default BondingModal;
