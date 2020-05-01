// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { encodeAddress } from '@polkadot/util-crypto';
import { writeStorage } from '@substrate/local-storage';

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

export function getCurrCartCount(): number {
  let count = 0;
  for (const key in localStorage) {
    if (isCartItem(key)) {
      count += 1;
    }
  }
  return count;
}

// stash/controller id's are stored by their public key by the nodewatcher so they need to be encoded first.
export function addToCart(stashPubKey: string): void {
  const stashid = encodeAddress(stashPubKey, 2);

  writeStorage(`cart:${stashid}`, stashid);
  const currCartCount = getCurrCartCount();
  writeStorage(`cartItemsCount`, currCartCount);
}

export function getCartItems(): Array<string> {
  const result = [];

  for (const key in localStorage) {
    if (isCartItem(key)) {
      result.push(key);
    }
  }

  return result;
}

export function clearCart(): void {
  for (const key in localStorage) {
    if (isCartItem(key)) {
      localStorage.removeItem(key);
    }
  }

  writeStorage('cartItemsCount', 0);
}

export function removeCartItem(itemKey: string, currCartCount: number): void {
  localStorage.removeItem(itemKey);

  writeStorage('cartItemsCount', currCartCount - 1);
}
