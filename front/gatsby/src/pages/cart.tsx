// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { Compact, createType } from '@polkadot/types';
import { Balance, ElectionStatus } from '@polkadot/types/interfaces';
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
import { take } from 'rxjs/operators';
import styled from 'styled-components';
import media from 'styled-media-query';

import {
  Button,
  ClosableTooltip,
  LoadableCartItems,
  NominationDetails,
  SubHeader,
  Text,
} from '../components';
import { getCartItems, validateFees } from '../util';
import { clearCart, stripAddressFromCartItem } from '../util/cartHelpers';

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

/*
 * N.b. Wwhatever amount is Bonded to the Controller is the amount that will be nominated. There is no way to nominate a fraction of the bond.
 */
const Cart = (_props: Props): React.ReactElement => {
  /* context */
  const {
    state: {
      accountBalanceMap,
      currentAccount,
      currentAccountNonce,
      stashControllerMap,
    },
  } = useContext(AccountsContext);
  const { api, isApiReady, fees } = useContext(ApiRxContext);
  const { enqueue, signAndSubmit } = useContext(TxQueueContext);

  /* state */
  const [allFees, setAllFees] = useState<BN>();
  const [allTotal, setAllTotal] = useState<BN>();
  const [cartItemsCount] = useLocalStorage('cartItemsCount');
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'rxjs'>>();
  const [isEraStatusValid, setEraElectionStatus] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [impliedStash, setImpliedStash] = useState<string>();
  const [nominationAmount, setNominationAmount] = useState<Compact<Balance>>();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [txId, setTxId] = useState<number>();

  useEffect(() => {
    const sub = api.query.staking
      .eraElectionStatus()
      .pipe(take(1))
      .subscribe((status: ElectionStatus) => {
        setEraElectionStatus(status.isClose);
      });

    return (): void => sub.unsubscribe();
  }, []);

  const checkFees = useCallback((): void => {
    if (
      api &&
      isApiReady &&
      currentAccount &&
      currentAccountNonce &&
      extrinsic &&
      fees &&
      nominationAmount
    ) {
      const [feeErrors, total, fee] = validateFees(
        currentAccountNonce,
        nominationAmount.toBn(),
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
    currentAccount,
    currentAccountNonce,
    extrinsic,
    fees,
    isApiReady,
    nominationAmount,
  ]);

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
  }, [
    api,
    allFees,
    allTotal,
    currentAccount,
    extrinsic,
    enqueue,
    nominationAmount,
  ]);

  useEffect(() => {
    if (txId !== undefined && !isSubmitted) {
      signAndSubmit(txId);
      setIsSubmitted(true);
    }
  }, [isSubmitted, txId, signAndSubmit]);

  useEffect(() => {
    const derivedStaking = Object.values(stashControllerMap).find(
      derivedStaking =>
        derivedStaking &&
        derivedStaking.controllerId &&
        derivedStaking.controllerId.toHuman &&
        derivedStaking.controllerId.toHuman() === currentAccount
    );

    const stash = derivedStaking?.stashId;
    const activeBonded = derivedStaking?.stakingLedger?.active;

    setImpliedStash(stash?.toHuman());
    setNominationAmount(activeBonded);
  }, [currentAccount, stashControllerMap]);

  useEffect(() => {
    const cartItems: string[] = getCartItems();

    const selectedNominees: string[] = cartItems.map((item: string) =>
      stripAddressFromCartItem(item)
    );

    setCartItems(selectedNominees);
  }, []);

  useEffect(() => {
    if (api && isApiReady && cartItems) {
      const extrinsic = api.tx.staking.nominate(cartItems);
      setExtrinsic(extrinsic);
    }
  }, [api, isApiReady, cartItems]);

  useEffect(() => {
    if (api && isApiReady) {
      if (!currentAccount) {
        setError('Please select an account to nominate as.');
        return;
      }

      setError(undefined);
      checkFees();
    }
  }, [api, checkFees, currentAccount, isApiReady]);

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
        <ClosableTooltip height='25%'>
          <SubHeader>Before you continue...</SubHeader>
          <Text>
            You are submitting the <b>intention</b> to nominate these accounts
            for the <b>next era.</b>
          </Text>

          <Text>
            <b>Payouts will happen at the end of an era</b>, at which point you
            will have the ability to claim your portion of the rewards.
          </Text>
        </ClosableTooltip>
        {isEraStatusValid ? (
          <>
            <HeadingDiv>
              <SubHeader>Review Details: </SubHeader>
            </HeadingDiv>
            <NominationDetails
              impliedStash={impliedStash}
              nominationAmount={nominationAmount && nominationAmount.toBn()}
            />
            {error ? (
              <ErrorText>{error}</ErrorText>
            ) : (
              <Button onClick={submitNomination} size='big'>
                Nominate!
              </Button>
            )}
          </>
        ) : (
          <>
            <SubHeader>Please come back later.</SubHeader>
            <Text>
              You cannot submit a nomination while there is an ongoing election
              for the next era validator set.
            </Text>
          </>
        )}
      </RightSide>
    </CartPageContainer>
  );
};

export default Cart;
