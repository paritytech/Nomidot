// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Icon } from '@substrate/ui-components';
import React from 'react';

interface Props {
  numberOfItemsInCart: number
}

export const ShoppingHeader = (props: Props) => {
  const { numberOfItemsInCart } = props;

  return <Icon bordered color='grey' name='cart arrow down' size='large'>{numberOfItemsInCart}</Icon>;
}