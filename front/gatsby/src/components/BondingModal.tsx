// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createType } from '@polkadot/types';
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
  StackedHorizontal,
} from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useState } from 'react';

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
  const { api, apiPromise } = useContext(ApiContext);
  const { enqueue } = useContext(TxQueueContext);

  const [accountForController, setAccountForController] = useState(
    currentAccount
  );
  const [accountForStash, setAccountForStash] = useState(currentAccount);
  const [bondAmount, setBondAmount] = useState<string>('');
  const [bondingError, setBondingError] = useState<Error>();
  const [rewardDestination, setRewardDestination] = useState<RewardDestination>(
    RewardDestination.Staked
  );
  const [allFees, setAllFees] = useState<BN>();
  const [allTotal, setAllTotal] = useState<BN>();

  const checkFees = useCallback(async () => {
    if (apiPromise && accountForStash && accountForController && bondAmount) {
      const submitBondExtrinsic = api.tx.staking.bond(
        accountForController,
        new BN(bondAmount),
        rewardDestination
      );

      const fees = await apiPromise.derive.balances.fees();
      const accountNonce = await apiPromise.query.system.account(
        accountForStash
      );

      const [feeErrors, total, fee] = validateFees(
        accountNonce,
        new BN(bondAmount),
        accountBalanceMap[accountForStash],
        submitBondExtrinsic,
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
  }, [
    apiPromise,
    accountForStash,
    accountForController,
    bondAmount,
    rewardDestination,
    accountBalanceMap,
  ]);

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
    checkFees,
    rewardDestination,
    checkUserInputs,
  ]);

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

  const signAndSubmitBond = () => {
    if (
      apiPromise &&
      accountForController &&
      accountForStash &&
      allFees &&
      allTotal
    ) {
      const submitBondExtrinsic = api.tx.staking.bond(
        accountForController,
        new BN(bondAmount),
        rewardDestination
      );

      const details: ExtrinsicDetails = {
        allFees,
        allTotal,
        amount: createType(api.registry, 'Balance', bondAmount),
        methodCall: 'staking.bond',
        senderPair: accountForStash,
      };

      enqueue(submitBondExtrinsic, details);
    }
  };

  return (
    <Modal trigger={<Button>New Bond</Button>}>
      <Modal.Header>Bonding Preferences</Modal.Header>
      <Modal.Content image>
        <Stacked alignItems='stretch' justifyContent='space-between'>
          <StackedHorizontal alignItems='stretch' justifyContent='space-around'>
            <Stacked justifyContent='flex-start' alignItems='flex-start'>
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
            </Stacked>
            <Stacked justifyContent='flex-start' alignItems='flex-start'>
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
            </Stacked>
          </StackedHorizontal>
          <Margin top />
          <Stacked justifyContent='space-around'>
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
              value={String(bondAmount)}
            />
            <Margin top />
            <Button onClick={signAndSubmitBond}>Submit Bond</Button>
          </Stacked>
          <Margin top />
          <Modal.Description>
            <ErrorText>{bondingError}</ErrorText>
          </Modal.Description>
        </Stacked>
      </Modal.Content>
    </Modal>
  );
};

export default BondingModal;
