// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { AddressSummary, Container, Grid, List, WithSpaceAround  } from '@substrate/ui-components';
import { Button, Subheading } from '@substrate/design-system';
import React, { useEffect, useState } from 'react';

import { getCartItems, stripAddressFromCartItem } from '../util/helpers';

type Props = RouteComponentProps;

const Cart = (_props: Props): React.ReactElement => {
  const [cartItems, setCartItems] = useState();

  useEffect(() => {
    const _cartItems = getCartItems();

    console.log(_cartItems);
    
    setCartItems(_cartItems);
  }, []);

  return (
    <Container>
      <Grid stretched>
        <Grid.Row>
          <Subheading>Your Cart:</Subheading>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width='6'>
            <List animated relaxed>
              {
                cartItems && cartItems.map((item: string) => (
                  <List.Item>
                    <WithSpaceAround>
                      <AddressSummary address={stripAddressFromCartItem(item)} noPlaceholderName orientation='horizontal' size='small' />
                    </WithSpaceAround>
                  </List.Item>
                ))
              }
            </List>
          </Grid.Column>
          <Grid.Column width='4' floated='right'>
            <Button>
              Checkout
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Cart;
