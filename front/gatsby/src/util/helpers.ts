// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import store from 'store';

export function toShortAddress(address: string | AccountId): string {
  if (typeof address !== 'string') {
    address = address.toString();
  }

  return address
    .slice(0, 8)
    .concat('...')
    .concat(address.slice(address.length - 5));
}

export function isCartItem(item: string): boolean {
  return item.startsWith('cart:');
}

export function stripAddressFromCartItem(item: string): string {
  return item.slice(5);
}

export function getCartItemsCount(): number {
  let count = 0;

  store.each((value, key) => {
    if (isCartItem(key)) {
      count += 1;
    }
  })

  return count;
}

export function getCartItems(): Array<string> {
  const result: Array<string> = [];

  store.each((value, key) => {
    if (isCartItem(key)) {
      result.push(key);
    }
  })

  return result;
}

export function clearCart(): void {
  store.each((value, key) => {
    if (isCartItem(key)) {
      store.remove(key);
    }
  });
}

export function removeCartItem(itemKey: string): void {
  store.remove(itemKey);
}
