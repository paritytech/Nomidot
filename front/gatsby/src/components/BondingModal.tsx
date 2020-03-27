// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountInfo } from '@polkadot/types/interfaces';
import BN from 'bn.js';
import { AccountsContext, ApiContext } from '@substrate/context';
import {
  Button,
  Spinner
} from '@substrate/design-system';
import {
  BalanceDisplay,
  Dropdown,
  DropdownProps,
  ErrorText,
  InputAddress,
  Modal,
  Stacked,
  StackedHorizontal
} from '@substrate/ui-components';
import React, { useState, useContext, useEffect } from 'react';

import { validateFees } from '../util/validateExtrinsic';

enum RewardDestination {
  'Stash',
  'Staked',
  'Controller'
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
  const { accountBalanceMap, allAccounts, currentAccount, loadingBalances } = useContext(AccountsContext);
  const { apiPromise } = useContext(ApiContext);
  const [accountForController, setAccountForController] = useState(currentAccount);
  const [accountForStash, setAccountForStash] = useState(currentAccount);
  const [bondAmount, setBondAmount] = useState<BN>(new BN(0));
  const [bondingError, setBondingError] = useState<Error>();
  const [rewardDestination, setRewardDestination] = useState<RewardDestination>(RewardDestination.Staked);

  const checkFees = async () => {
    if (apiPromise) {
      const submitBondExtrinsic = apiPromise.tx.staking.bond(accountForController!, bondAmount, rewardDestination!);
      const fees = await apiPromise.derive.balances.fees();
      const accountNonce = await apiPromise.query.system.account(accountForStash) as AccountInfo;
  
      const feeErrors = validateFees(accountNonce, undefined, accountBalanceMap[accountForStash!], submitBondExtrinsic, fees, undefined);
  
      if (feeErrors) {
        setBondingError(feeErrors[0]);
      }
    }
  }

  useEffect(() => {
    if (apiPromise) {
      if (!accountForStash) {
        setBondingError('Please select an account to use as your stash.');
        return;
      }
  
      if (!accountForController) {
        setBondingError('Please select an account to use as your controller.');
        return;
      }

      if (!rewardDestination) {
        setBondingError('Please select a reward destination.');
        return;
      }

      checkFees();
    }
  }, [accountForStash, accountForController, rewardDestination])

  const selectStash = (address: string) => {
    setAccountForStash(address);
  }

  const selectController = (address: string) => {
    setAccountForController(address);
  }

  const handleSetRewardDestination = (_event: React.SyntheticEvent,
    { value }: DropdownProps) => {

    setRewardDestination(value as RewardDestination);
  }

  return (
    <Modal trigger={<Button>New Bond</Button>}>
      <Modal.Header>Bonding Preferences</Modal.Header>
      <Modal.Content image>
        <StackedHorizontal alignItems='stretch' justifyContent='space-between'>
          <Stacked justifyContent='flex-start' alignItems='center'>
            <b>Choose Stash:</b>
            {
              currentAccount
                ? (
                  <>
                    <InputAddress
                      accounts={allAccounts}
                      fromKeyring={false}
                      onChangeAddress={selectStash}
                      value={accountForStash || currentAccount}
                      width='175px'
                    />
                    {
                      loadingBalances
                        ? <p>Loading Balances</p>
                        : <BalanceDisplay allBalances={accountBalanceMap[accountForStash || currentAccount]} />
                    }
                  </>
                )
                : <Spinner active inline />
            }
          </Stacked>
          <Stacked justifyContent='center'>
            <b>Choose Controller:</b>
              {
                currentAccount
                  ? (
                  <>
                    <InputAddress
                      accounts={allAccounts}
                      fromKeyring={false}
                      onChangeAddress={selectController}
                      value={accountForController || currentAccount}
                      width='175px' />
                    {
                      loadingBalances
                        ? (
                          'Loading Balances'
                        )
                        : <BalanceDisplay allBalances={accountBalanceMap[accountForController || currentAccount]} />
                    }
                  </>
                  )
                  : <Spinner active inline />
              }
            </Stacked>
            <Stacked>
              <Dropdown
                placeholder='Reward Destination'
                selection
                onChange={handleSetRewardDestination}
                options={rewardDestinationOptions}
              />
            </Stacked>
        </StackedHorizontal>
        
        <Modal.Description>
          <ErrorText>{bondingError}</ErrorText>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default BondingModal;