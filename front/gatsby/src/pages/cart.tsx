// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { createType } from '@polkadot/types';
import { RouteComponentProps } from '@reach/router';
import {
  AccountsContext,
  ApiRxContext,
  ExtrinsicDetails,
  TxQueueContext,
} from '@substrate/context';
import { useLocalStorage } from '@substrate/local-storage';
import { ErrorText, Icon } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import media from 'styled-media-query';

import {
  Button,
  LoadableCartItems,
  NominationDetails,
  SubHeader,
} from '../components';
import { getCartItems, validateFees } from '../util';
import { clearCart } from '../util/cartHelpers';

const CartPageContainer = styled.div`
  display: flex;
  padding: 18px;

  ${media.lessThan('medium')`
    display: flex column;
  `}
`;

const HeadingDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSide = styled.div`
  display: flex column;
  flex: 1;
  padding: 10px;
`;

const RightSide = styled.div`
  flex: 2;
  padding: 10px;
  margin-left: 30px;
`;

type Props = RouteComponentProps;

const Cart = (_props: Props): React.ReactElement => {
  const { accountBalanceMap, currentAccount, currentAccountNonce } = useContext(
    AccountsContext
  );
  const { api, isApiReady, fees } = useContext(ApiRxContext);
  const { enqueue, signAndSubmit } = useContext(TxQueueContext);
  const [allFees, setAllFees] = useState<BN>();
  const [allTotal, setAllTotal] = useState<BN>();
  const [cartItemsCount] = useLocalStorage('cartItemsCount');
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [errors, setErrors] = useState<string[]>([]);
  const [nominationAmount, setNominationAmount] = useState<string>('');
  const [txId, setTxId] = useState<number>();

  const checkFees = (): void => {
    if (
      api &&
      isApiReady &&
      currentAccount &&
      currentAccountNonce &&
      nominationAmount &&
      extrinsic &&
      fees
    ) {
      const [feeErrors, total, fee] = validateFees(
        currentAccountNonce,
        new BN(nominationAmount),
        accountBalanceMap[currentAccount],
        extrinsic,
        fees
      );

      setAllTotal(total);
      setAllFees(fee);
      setErrors(feeErrors);
    }
  };

  const handleUserInputChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setNominationAmount(value);
    checkFees();
  };

  const setExtrinsicDetails = () => {
    if (isApiReady) {
      const extrinsic = api.tx.staking.nominate(cartItems);

      setExtrinsic(extrinsic);
    }
  };

  const submitNomination = () => {
    if (api && allFees && allTotal && currentAccount && extrinsic) {
      const details: ExtrinsicDetails = {
        allFees,
        allTotal,
        amount: createType(api.registry, 'Balance', nominationAmount),
        methodCall: 'staking.nominate',
        senderPair: currentAccount,
      };

      const id = enqueue(extrinsic, details);
      setTxId(id);
    }
  };

  useEffect(() => {
    txId && signAndSubmit(txId);
  }, [txId]);

  useEffect(() => {
    const _cartItems = getCartItems();

    setCartItems(_cartItems);
  }, [cartItemsCount]);

  useEffect(() => {
    setExtrinsicDetails();
  }, [isApiReady, cartItems]);

  return (
    <CartPageContainer>
      <LeftSide>
        <HeadingDiv>
          <SubHeader>Your Cart: </SubHeader>
          <Button neutral onClick={clearCart}>
            Clear
          </Button>
        </HeadingDiv>
        <LoadableCartItems
          cartItems={cartItems}
          cartItemsCount={Number(cartItemsCount)}
        />
      </LeftSide>

      <RightSide>
        <HeadingDiv>
          <SubHeader>Review Details: </SubHeader>
          <Button primary disabled onClick={submitNomination}>
            Nominate!
          </Button>
        </HeadingDiv>
        <NominationDetails
          nominationAmount={nominationAmount}
          handleUserInputChange={handleUserInputChange}
        />
        {errors.length ? (
          <ErrorText>{errors[0]}</ErrorText>
        ) : (
          <Icon name='check' color='green' />
        )}
      </RightSide>
    </CartPageContainer>
  );
};

export default Cart;
