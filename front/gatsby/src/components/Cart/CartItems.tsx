// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/context';
import { Button, Subheading } from '@substrate/design-system';
import { useLocalStorage } from '@substrate/local-storage';
import {
  AddressSummary,
  Icon,
  List,
  Margin,
  Stacked,
  StackedHorizontal,
  WithSpaceAround,
} from '@substrate/ui-components';
import { navigate } from 'gatsby';
import React, { useContext, useEffect, useState } from 'react';

import {
  getCartItems,
  removeCartItem,
  stripAddressFromCartItem,
} from '../../util/helpers';

const CartItems = () => {
  const [cartItemsCount] = useLocalStorage('cartItemsCount');
  const { api } = useContext(ApiContext);
  const [cartItems, setCartItems] = useState<string[]>([]);

  useEffect(() => {
    const _cartItems = getCartItems();

    setCartItems(_cartItems);
  }, [cartItemsCount]);

  const renderCartEmpty = () => {
    return (
      <Stacked>
        <Subheading>Cart Empty</Subheading>
        <p>you should add some validators to nominate...</p>
        <Button onClick={() => navigate('/validators')}>Take Me There!</Button>
      </Stacked>
    );
  };

  const removeItemFromCart = ({
    currentTarget: {
      dataset: { key },
    },
  }: React.MouseEvent<HTMLButtonElement>) => {
    // FIXME: use store.js and subscribe events so this update happens immediately (not on refresh).
    if (key) {
      removeCartItem(key, Number(cartItemsCount));
    } else {
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <List animated relaxed>
      {cartItems.length
        ? cartItems.map((item: string) => {
            const address = stripAddressFromCartItem(item);

            return (
              <List.Item key={item}>
                <WithSpaceAround>
                  <StackedHorizontal>
                    <AddressSummary
                      address={address}
                      api={api}
                      noPlaceholderName
                      orientation='horizontal'
                      size='small'
                    />
                    <Margin left />
                    <Icon
                      name='close'
                      link
                      onClick={removeItemFromCart}
                      data-key={item}
                    />
                    {/* TODO: <NominationDetails address={address} /> */}
                  </StackedHorizontal>
                </WithSpaceAround>
              </List.Item>
            );
          })
        : renderCartEmpty()}
    </List>
  );
};

export default CartItems;
