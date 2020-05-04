// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ApiRxContext, TxQueueContext, AccountsContext } from '@substrate/context';
import { ErrorText, Input } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useCallback, useContext, useState, useEffect } from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal'
import styled from 'styled-components';

import { AddressSummary, Button, ClosableTooltip, SubHeader, Text } from './index';
import { validateFees } from '../util';

const LayoutRow = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px;
`

const LayoutRowItem = styled.div`
  display: flex column;
  justify-content: flex-start;
  align-items: space-around;
  width: 25rem;
`

interface Props {
  stashId: string,
}

const BondExtraModal = (props: Props) => {
  const { stashId } = props;
  const { api, isApiReady, fees } = useContext(ApiRxContext);
  const { state: { accountBalanceMap, currentAccountNonce, stashControllerMap } } = useContext(AccountsContext);
  const { enqueue, signAndSubmit } = useContext(TxQueueContext);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [allFees, setAllFees] = useState<BN>();
  const [allTotal, setAllTotal] = useState<BN>();
  const [canSubmit, setCanSubmit] = useState(false);
  const [error, setError] = useState<string>();
  const [maxAdditional, setMaxAdditional] = useState<BN>(new BN(0));

  useEffect(() => {
    if (api && isApiReady && maxAdditional) {
      setExtrinsic(api.tx.staking.bondExtra(maxAdditional));
    }
  }, [api, isApiReady, maxAdditional]);

  useEffect(() => {
    if (api && isApiReady) {
      checkUserInputs();
      checkFees();
    }
  }, [
    api,
    isApiReady,
    stashId,
    maxAdditional
  ]);

  useEffect(() => {
    if (!error) {
      setCanSubmit(true);
    }
  }, [error])

  const submitBondExtra = useCallback(() => {

  
  }, []);

  const checkFees = useCallback((): void => {
    if (
      api &&
      isApiReady &&
      stashId &&
      stashControllerMap &&
      currentAccountNonce &&
      maxAdditional &&
      extrinsic &&
      fees
    ) {
      const [feeErrors, total, fee] = validateFees(
        currentAccountNonce,
        new BN(maxAdditional),
        accountBalanceMap[stashId],
        extrinsic,
        fees
      );

      setAllTotal(total);
      setAllFees(fee);
      
      if (feeErrors) {
        setError(feeErrors[0]);
      } else {
        setError(undefined);
      }
    }
  }, [
    accountBalanceMap,
    stashId,
    stashControllerMap,
    currentAccountNonce,
    maxAdditional,
    extrinsic,
    fees
  ]);

  const checkUserInputs = useCallback(() => {
    // check maxAdditional greater than 0
    if (maxAdditional?.lten(0)) {
      setError('If you want to bond more funds, you should set a value greater than 0.')
    }
    // error if stash free balance - existentialdeposit <= maxAdditional
    if (fees && accountBalanceMap[stashId]?.freeBalance.sub(fees.existentialDeposit.toBn()).lte(maxAdditional)) {
      setError('This will drop your stash account below its existential deposit. While this is technically possible, it is highly inadvisable and unsupported through Nomi.');
    }
  }, [accountBalanceMap, fees, maxAdditional]);

  const handleUserInputChange = useCallback(({ target: { value }}) => {
    setMaxAdditional(new BN(value));
  }, [maxAdditional]);

  return (
    <Modal
      closeIcon
      closeOnDimmerClick
      dimmer
      trigger={
       <Dropdown.Item text='Bond More Funds' />
      }
    >
      <Modal.Header>Bond More Funds</Modal.Header>
      <ClosableTooltip>
        <Text>
          Bonding more funds means you are increasing the amount of KSM bonded from your Stash account to be used by your Controller.
        </Text>
        <Text>
          Tip: You should only bond as much as you intend to use for nominating, as you don't want to unnecessarily put funds at risk.
        </Text>
      </ClosableTooltip>
      <Modal.Content>
        <LayoutRow>
          <LayoutRowItem>
            <SubHeader>Bond from:</SubHeader>
            <AddressSummary address={stashId} api={api} size='small' />
          </LayoutRowItem>
          <LayoutRowItem>
            <SubHeader>To:</SubHeader>
            <AddressSummary 
                address={stashControllerMap[stashId] 
                        && stashControllerMap[stashId].controllerId?.toHuman
                        && stashControllerMap[stashId].controllerId?.toHuman()}
                api={api}
                size='small' />
          </LayoutRowItem>
        </LayoutRow>
        <LayoutRow>
          <LayoutRowItem>
            <SubHeader>Amount:</SubHeader>
            <Input
              fluid
              label='UNIT'
              labelPosition='right'
              min={new BN(0)}
              onChange={handleUserInputChange}
              placeholder='e.g. 1.00'
              type='number'
              value={maxAdditional}
            />
          </LayoutRowItem>
        </LayoutRow>
      </Modal.Content>

      <Modal.Description>
        <ErrorText>{error}</ErrorText>
        <Button float='right' size='big' onClick={submitBondExtra}>Bond Extra</Button>
      </Modal.Description>
    </Modal>
  )
}

export default React.memo(BondExtraModal);