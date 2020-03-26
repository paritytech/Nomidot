// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext } from '@substrate/context';
import {
  Button,
  Spinner
} from '@substrate/design-system';
import {
  AddressSummary,
  BalanceDisplay,
  Container,
  Dropdown,
  ErrorText,
  Header,
  InputAddress,
  Modal,
  Stacked,
  StackedHorizontal,
  Table,
} from '@substrate/ui-components';
import React, { useState, useContext } from 'react';

type Errors = string[];

const BondingModal = (): React.ReactElement => {
  const { accountBalanceMap, allAccounts, currentAccount, loadingBalances } = useContext(AccountsContext);
  const [accountForController, setAccountForController] = useState(currentAccount);
  const [accountForStash, setAccountForStash] = useState(currentAccount);
  const [bondingErrors, setBondingErrors] = useState<Errors>([]);

  const selectStash = (address: string) => {
    setAccountForStash(address);
  }

  const selectController = (address: string) => {
    setAccountForController(address);
  }

  return (
    <Modal trigger={<Button>New Bond</Button>}>
      <Modal.Header>Bonding Preferences</Modal.Header>
      <Modal.Content image>
        <StackedHorizontal justifyContent='space-around'>
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
                        ? (
                          'Loading Balances'
                        )
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
        </StackedHorizontal>
        
        <Modal.Description>
          {
            bondingErrors.map((error) => {
              <ErrorText>error</ErrorText>
            })
          }
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default BondingModal;