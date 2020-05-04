// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingQuery } from '@polkadot/api-derive/types';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ApiRxContext, TxQueueContext, AccountsContext } from '@substrate/context';
import { Input } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useCallback, useContext, useState, useEffect } from 'react';
import Dropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
import Modal from 'semantic-ui-react/dist/commonjs/modules/Modal'

import { Button, ClosableTooltip, SubHeader, Text } from './index';
import { validateFees } from '../util';

interface Props {
  stashId: string,
}

const BondExtraModal = (props: Props) => {
  const { stashId } = props;
  const { api, fees } = useContext(ApiRxContext);
  const { state: { accountBalanceMap, currentAccountNonce, stashControllerMap } } = useContext(AccountsContext);
  const { enqueue, signAndSubmit } = useContext(TxQueueContext);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [allFees, setAllFees] = useState<BN>();
  const [allTotal, setAllTotal] = useState<BN>();
  const [error, setError] = useState<string>();
  const [maxAdditional, setMaxAdditional] = useState<BN>();

  useEffect(() => {
    if (api && maxAdditional) {
      setExtrinsic(api.tx.staking.bondExtra(maxAdditional));
    }
  }, [api, maxAdditional])

  const submitBondExtra = useCallback(() => {

  
  }, []);


  const checkFees = useCallback((): void => {
    if (
      api &&
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


  const handleUserInputChange = useCallback(({ target: { value }}) => {
    setMaxAdditional(new BN(value));
  }, []);

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
        <SubHeader>Bond from:</SubHeader>
        <Text>{stashId}</Text>
        <SubHeader>To:</SubHeader>
        <Text>
          {
            stashControllerMap[stashId] 
            && stashControllerMap[stashId].controllerId?.toHuman
            && stashControllerMap[stashId].controllerId?.toHuman()}</Text>

        <SubHeader>Amount:</SubHeader>  
        <Input
          fluid
          label='UNIT'
          labelPosition='right'
          min={0}
          onChange={handleUserInputChange}
          placeholder='e.g. 1.00'
          type='number'
          value={maxAdditional}
        />
      </Modal.Content>

      <Modal.Description>
        <Button float='right' size='big' onClick={submitBondExtra}>Bond Extra</Button>
      </Modal.Description>
    </Modal>
  )
}

export default React.memo(BondExtraModal);