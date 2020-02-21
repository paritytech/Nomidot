// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export function toShortAddress(address: string): string {
  return address
    .slice(0, 8)
    .concat('...')
    .concat(address.slice(address.length - 5));
}

export function isCartItem(key: string) {
  console.log('key -> ', key);
  return key.slice(0, 5) === 'cart:';
}