// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { createType } from '@polkadot/types';
import { AccountsContext, ApiRxContext, ExtrinsicDetails, TxQueueContext } from '@substrate/context';
import { ErrorText, Input } from '@substrate/ui-components';
import BN from 'bn.js';
import { navigate } from 'gatsby';
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

  /* context */
  const { api, isApiReady, fees } = useContext(ApiRxContext);
  const { state: { accountBalanceMap, currentAccountNonce, loadingBalances, stashControllerMap } } = useContext(AccountsContext);
  const { enqueue, signAndSubmit } = useContext(TxQueueContext);

  /* state */
  const [allFees, setAllFees] = useState<BN>();
  const [allTotal, setAllTotal] = useState<BN>();
  const [canSubmit, setCanSubmit] = useState(false);
  const [controllerId, setControllerId] = useState<string>();
  const [error, setError] = useState<string>();
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [maxAdditional, setMaxAdditional] = useState<BN>(new BN(0));
  const [txId, setTxId] = useState<number>();

  /* set the extrinsic, to be signed and submitted */
  useEffect(() => {
    if (api && isApiReady && maxAdditional) {
      setExtrinsic(api.tx.staking.bondExtra(maxAdditional));
    }
  }, [api, isApiReady, maxAdditional]);
  
  /* set the controllerId */
  useEffect(() => {
    if (stashId && stashControllerMap) {
      setControllerId(
        stashControllerMap[stashId] 
        && stashControllerMap[stashId].controllerId?.toHuman
        && stashControllerMap[stashId].controllerId?.toHuman());
    }
  }, [api, isApiReady, stashId, stashControllerMap])

  /* validate user inputs, fees */
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

  /* set whether button should be disabled */
  useEffect(() => {
    if (!error) {
      setCanSubmit(true);
    }
  }, [error])

  useEffect(() => {
    if (txId) {
      signAndSubmit(txId);
      navigate('/accounts');
    }
  }, [txId])

  const submitBondExtra = useCallback(() => {
    if (
      api &&
      stashId &&
      allFees &&
      allTotal &&
      extrinsic
    ) {
      const details: ExtrinsicDetails = {
        allFees,
        allTotal,
        amount: createType(api.registry, 'Balance', maxAdditional),
        methodCall: 'staking.bondExtra',
        senderPair: stashId,
      };

      const id = enqueue(extrinsic, details);
      setTxId(id);
    }
  }, [
    api,
    controllerId,
    stashId,
    allFees,
    allTotal,
    maxAdditional,
    extrinsic,
    enqueue,
  ]);

  const checkFees = useCallback((): void => {
    if (
      api &&
      isApiReady &&
      accountBalanceMap &&
      !loadingBalances &&
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
                address={controllerId}
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
        <Button disabled={!canSubmit} float='right' size='big' onClick={submitBondExtra}>Bond Extra</Button>
      </Modal.Description>
    </Modal>
  )
}

export default React.memo(BondExtraModal);