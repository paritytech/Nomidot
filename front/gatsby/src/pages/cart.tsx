// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { Button, Subheading } from '@substrate/design-system';
import { Container, Grid, StackedHorizontal } from '@substrate/ui-components';
import React from 'react';

import { LoadableCartItems } from '../components';
import { clearCart } from '../util/cartHelpers';

type Props = RouteComponentProps;

const Cart = (_props: Props): React.ReactElement => {
  return (
    <Container>
      <Grid stretched>
        <Grid.Row>
          <Grid.Column floated='left' width='6'>
            <StackedHorizontal justifyContent='space-between'>
              <Subheading>Your Cart: </Subheading>
              <Button appearance='outline' onClick={clearCart} size='tiny'>
                Clear
              </Button>
            </StackedHorizontal>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width='6'>
            <LoadableCartItems />
          </Grid.Column>
          <Grid.Column width='4' floated='right'>
            <Button>Checkout</Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Cart;
