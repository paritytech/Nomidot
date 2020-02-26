// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { Button, Subheading } from '@substrate/design-system';
import {
  AddressSummary,
  Container,
  Grid,
  Icon,
  List,
  Margin,
  Stacked,
  StackedHorizontal,
  WithSpaceAround,
} from '@substrate/ui-components';
import { navigate } from 'gatsby';
import React, { useEffect, useState } from 'react';

import {
  clearCart,
  getCartItems,
  removeCartItem,
  stripAddressFromCartItem,
} from '../util/helpers';

type Props = RouteComponentProps;

const Cart = (_props: Props): React.ReactElement => {
  const [cartItems, setCartItems] = useState<string[]>([]);

  useEffect(() => {
    const _cartItems = getCartItems();

    setCartItems(_cartItems);
  }, []);

  const removeItemFromCart = ({
    currentTarget: {
      dataset: { key },
    },
  }: React.MouseEvent<HTMLButtonElement>) => {
    // FIXME: use store.js and subscribe events so this update happens immediately (not on refresh).
    if (key) {
      removeCartItem(key);
    } else {
      alert('Something went wrong. Please try again later.');
    }
  };

  const renderCartEmpty = () => {
    return (
      <Stacked>
        <Subheading>Cart Empty</Subheading>
        <p>you should add some validators to nominate...</p>
        <Button onClick={() => navigate('/validators')}>Take Me There!</Button>
      </Stacked>
    );
  };

  return (
    <Container>
      <Grid stretched>
        <Grid.Row>
          <Grid.Column floated='left' width='6'>
            <StackedHorizontal justifyContent='space-between'>
              <Subheading>Your Cart: ({cartItems.length}) items </Subheading>
              <Button appearance='outline' onClick={clearCart} size='tiny'>
                Clear
              </Button>
            </StackedHorizontal>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width='6'>
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
          </Grid.Column>
          <Grid.Column width='4' floated='right'>
            <Button disabled={!cartItems.length}>Checkout</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Cart;
