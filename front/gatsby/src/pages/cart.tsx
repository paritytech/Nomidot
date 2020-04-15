// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { RouteComponentProps } from '@reach/router';
import { AccountsContext, ApiContext } from '@substrate/context';
import { useLocalStorage } from '@substrate/local-storage';
import React, { useContext, useEffect, useState } from 'react';
import media from 'styled-media-query';
import styled from 'styled-components';

import BN from 'bn.js';

import {
  getCartItems,
  validateFees
} from '../util';

import { Button, LoadableCartItems, NominationDetails, SubHeader } from '../components';
import { clearCart } from '../util/cartHelpers';

const CartPageContainer = styled.div`
  display: flex;
  padding: 18px;

  ${media.lessThan("medium")`
    display: flex column;
  `}
`

const HeadingDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftSide = styled.div`
  display: flex column;
  flex: 1;
  padding: 10px;
`

const RightSide = styled.div`
  flex: 2;
  padding: 10px;
  margin-left: 30px;
`

type Props = RouteComponentProps;

const Cart = (_props: Props): React.ReactElement => {
  const { currentAccount } = useContext(AccountsContext);
  const { api, apiPromise, isApiReady } = useContext(ApiContext);
  const [cartItemsCount] = useLocalStorage('cartItemsCount');
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [nominationAmount, setNominationAmount] = useState<string>('');

  const checkFees = async () => {
    if (
      apiPromise &&
      isApiReady &&
      currentAccount &&
      nominationAmount &&
      extrinsic
    ) {
      const fees = await apiPromise.derive.balances.fees();
      const accountNonce = await apiPromise.query.system.account(currentAccount);

      const [feeErrors, total, fee] = validateFees(
        accountNonce,
        new BN(nominationAmount),
        currentAccount,
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

  const setExtrinsicDetails = () => {
    const extrinsic = api.tx.staking.nominate(cartItems);
    
    setExtrinsic(extrinsic)
  }

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
        <LoadableCartItems cartItems={cartItems} cartItemsCount={Number(cartItemsCount)} />
      </LeftSide>

      <RightSide>
        <NominationDetails nominationAmount={nominationAmount} setNominationAmount={setNominationAmount} />
      </RightSide>
    </CartPageContainer>
  );
};

export default Cart;
