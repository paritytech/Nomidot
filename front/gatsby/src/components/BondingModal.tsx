// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveFees } from '@polkadot/api-derive/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { createType } from '@polkadot/types';
import { AccountInfo } from '@polkadot/types/interfaces';
import {
  AccountsContext,
  ApiRxContext,
  ExtrinsicDetails,
  handler,
  TxQueueContext,
} from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import {
  BalanceDisplay,
  Dropdown,
  DropdownProps,
  ErrorText,
  Input,
  InputAddress,
  List,
  Margin,
  Modal,
  Stacked,
} from '@substrate/ui-components';
import BN from 'bn.js';
import { navigate } from 'gatsby';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { take } from 'rxjs/operators';

import { validateFees } from '../util/validateExtrinsic';
import { Button } from './Button';

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
    state: { accountBalanceMap, allAccounts, currentAccount, loadingBalances },
  } = useContext(AccountsContext);
  const { api, isApiReady } = useContext(ApiRxContext);
  const { enqueue, signAndSubmit, txQueue } = useContext(TxQueueContext);

  const [accountForController, setAccountForController] = useState(
    currentAccount
  );
  const [accountForStash, setAccountForStash] = useState(currentAccount);
  const [accountNonce, setAccountNonce] = useState<AccountInfo>();
  const [allFees, setAllFees] = useState<BN>();
  const [allTotal, setAllTotal] = useState<BN>();
  const [bondAmount, setBondAmount] = useState<string>('');
  const [bondingError, setBondingError] = useState<Error>();
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [fees, setFees] = useState<DeriveFees>();
  const [rewardDestination, setRewardDestination] = useState<RewardDestination>(
    RewardDestination.Staked
  );
  const [txId, setTxId] = useState<number>();

  useEffect(() => {
    if (api && isApiReady) {
      const sub = api.derive.balances
        .fees()
        .pipe(take(1))
        .subscribe((result: DeriveFees) => setFees(result));

      return (): void => sub.unsubscribe();
    }
  }, [api, isApiReady]);

  useEffect(() => {
    if (api && isApiReady) {
      const sub = api.query.system
        .account<AccountInfo>(accountForStash)
        .pipe(take(1))
        .subscribe((result: AccountInfo) => setAccountNonce(result));

      return (): void => sub.unsubscribe();
    }
  }, [accountForStash, api, isApiReady]);

  const checkFees = useCallback((): void => {
    if (
      isApiReady &&
      accountForStash &&
      accountForController &&
      accountNonce &&
      bondAmount &&
      extrinsic &&
      fees
    ) {
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
  }, [
    accountBalanceMap,
    accountForStash,
    accountForController,
    accountNonce,
    bondAmount,
    extrinsic,
    fees,
    isApiReady,
  ]);

  const checkUserInputs = useCallback((): void => {
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

    setBondingError(undefined);
  }, [accountForStash, accountForController, rewardDestination]);

  useEffect(() => {
    if (accountForController && api && isApiReady) {
      const submitBondExtrinsic = api.tx.staking.bond(
        accountForController,
        new BN(bondAmount),
        rewardDestination
      );

      setExtrinsic(submitBondExtrinsic);
    }
  }, [accountForController, api, bondAmount, isApiReady, rewardDestination]);

  useEffect(() => {
    if (currentAccount) {
      setAccountForStash(currentAccount);
      setAccountForController(currentAccount);
    }
  }, [currentAccount]);

  useEffect(() => {
    if (api) {
      checkUserInputs();
      checkFees();
    }
  }, [
    api,
    accountForStash,
    accountForController,
    bondAmount,
    checkFees,
    checkUserInputs,
    rewardDestination,
  ]);

  useEffect(() => {
    if (txId) {
      signAndSubmit(txId);
      navigate('/accounts');
    }
  }, [signAndSubmit, txId, txQueue]);

  const selectStash = useCallback((address: string): void => {
    setAccountForStash(address);
  }, []);

  const selectController = useCallback((address: string): void => {
    setAccountForController(address);
  }, []);

  const handleSetRewardDestination = useCallback(
    (_event: React.SyntheticEvent, { value }: DropdownProps) => {
      setRewardDestination(value as RewardDestination);
    },
    []
  );

  const signAndSubmitBond = useCallback(() => {
    if (
      api &&
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
      setTxId((id as unknown) as number);
    }
  }, [
    api,
    accountForController,
    accountForStash,
    allFees,
    allTotal,
    bondAmount,
    extrinsic,
    enqueue
  ]);

  return (
    <Modal
      closeIcon
      closeOnDimmerClick
      dimmer
      trigger={
        <List.Item>
          <Button neutral>New Bond</Button>
        </List.Item>
      }
    >
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
            <Button size='huge' onClick={signAndSubmitBond}>
              Submit Bond
            </Button>
            <ErrorText>{bondingError}</ErrorText>
          </Modal.Description>
        </Stacked>
      </Modal.Content>
    </Modal>
  );
};

export { BondingModal };
