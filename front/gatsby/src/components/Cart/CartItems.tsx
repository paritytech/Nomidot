// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRxContext } from '@substrate/context';
import {
  Icon,
  List,
  Margin,
  StackedHorizontal,
  WithSpaceAround,
} from '@substrate/ui-components';
import { navigate } from 'gatsby';
import React, { useContext } from 'react';

import { removeCartItem } from '../../util/cartHelpers';
import { AddressSummary, Button, SubHeader, Text, Tooltip } from '../index';

interface Props {
  cartItems: string[];
  cartItemsCount: number;
}

const CartItems = (props: Props): React.ReactElement => {
  const { cartItems, cartItemsCount } = props;

  const { api } = useContext(ApiRxContext);

  const renderCartEmpty = (): React.ReactElement => {
    return (
      <Tooltip>
        <SubHeader>Cart Empty</SubHeader>
        <Text>you should add some validators to nominate...</Text>
        <Button
          neutral
          size='big'
          float='right'
          onClick={(): Promise<void> => navigate('/validators')}
        >
          Take Me There!
        </Button>
      </Tooltip>
    );
  };

  const removeItemFromCart = ({
    currentTarget: {
      dataset: { key },
    },
  }: React.MouseEvent<HTMLButtonElement>): void => {
    if (key) {
      removeCartItem(key, cartItemsCount);
    } else {
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <List relaxed>
      {cartItems.length
        ? cartItems.map((address: string) => {
            return (
              <List.Item key={address}>
                <WithSpaceAround>
                  <StackedHorizontal>
                    <AddressSummary
                      api={api}
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
                      data-key={address}
                    />
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
