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
import { ErrorText } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useCallback, useContext, useEffect, useState } from 'react';
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
    display: flex;
    flex-direction: column;
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
  padding: 18px;
`;

const RightSide = styled.div`
  flex: 2;
  justify-content: center;
  align-items: center;
  padding: 18px;
  margin-left: 30px;

  > a {
    float: right;
  }
`;

type Props = RouteComponentProps;

const Cart = (_props: Props): React.ReactElement => {
  const {
    state: {
      accountBalanceMap,
      allStashes,
      currentAccount,
      currentAccountNonce,
    },
  } = useContext(AccountsContext);
  const { api, isApiReady, fees } = useContext(ApiRxContext);
  const { enqueue, signAndSubmit } = useContext(TxQueueContext);
  const [allFees, setAllFees] = useState<BN>();
  const [allTotal, setAllTotal] = useState<BN>();
  const [cartItemsCount] = useLocalStorage('cartItemsCount');
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [error, setError] = useState<string>();
  const [nominationAmount, setNominationAmount] = useState<string>('');
  const [txId, setTxId] = useState<number>();

  const checkFees = useCallback((): void => {
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
      setError(feeErrors[0] || undefined);
    }
  }, [
    accountBalanceMap,
    api,
    api.tx.staking,
    currentAccount,
    currentAccountNonce,
    nominationAmount,
    extrinsic,
    fees,
    isApiReady,
    nominationAmount
  ]);

  const checkUserInputs = useCallback((): void => {
    if (!currentAccount) {
      setError('Please select an account to nominate as.');
      return;
    } else if (allTotal) {
      // check nominateAs has enough balance
      const derivedBalances = accountBalanceMap[currentAccount];

      if (derivedBalances.freeBalance <= allTotal) {
        setError(
          'This account does not have enough balance to perform this extrinsic.'
        );
        return;
      }
    } else if (!allStashes.includes(currentAccount)) {
      // check nominateAs is bonded
      setError('Account not bonded (must be either stash or controller).');
    } else {
      setError(undefined);
      return;
    }
  }, [allStashes, allTotal, currentAccount]);

  const handleUserInputChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
      setNominationAmount(value);
      checkFees();
    },
    [checkFees, setNominationAmount]
  );

  const submitNomination = useCallback((): void => {
    if (api && allFees && allTotal && currentAccount && extrinsic) {
      const details: ExtrinsicDetails = {
        allFees,
        allTotal,
        amount: createType(api.registry, 'Balance', nominationAmount),
        methodCall: 'staking.nominate',
        senderPair: currentAccount, // needs to be submitted with the controller.
      };

      const id = enqueue(extrinsic, details);
      setTxId(id);
    }
  }, [api, allFees, allTotal, currentAccount, extrinsic, enqueue]);

  useEffect(() => {
    txId && signAndSubmit(txId);
  }, [txId, signAndSubmit]);

  useEffect(() => {
    const _cartItems = getCartItems();

    setCartItems(_cartItems);
  }, [cartItemsCount]);

  useEffect(() => {
    if (isApiReady) {
      const extrinsic = api.tx.staking.nominate(cartItems);

      setExtrinsic(extrinsic);
    }
  }, [isApiReady, cartItems]);

  useEffect(() => {
    checkUserInputs();
  }, [checkUserInputs, currentAccount, nominationAmount]);

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
        </HeadingDiv>
        <NominationDetails
          nominationAmount={nominationAmount}
          handleUserInputChange={handleUserInputChange}
        />
        {error ? (
          <ErrorText>{error}</ErrorText>
        ) : (
          <Button onClick={submitNomination}>Nominate!</Button>
        )}
      </RightSide>
    </CartPageContainer>
  );
};

export default Cart;
