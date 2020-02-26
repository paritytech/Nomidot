// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export function toShortAddress(address: string): string {
  return address
    .slice(0, 8)
    .concat('...')
    .concat(address.slice(address.length - 5));
}

export function isCartItem(item: string): boolean {
  return item.slice(0, 5) === 'cart:';
}

export function getCartItemsCount(): number {
  let count = 0;

  for (let key in localStorage) {
    if (isCartItem(key)) {
      count += 1;
    }
  }

  return count;
}

export function getCartItems(): Array<string> {
  let result = [];

  for (let key in localStorage) {
    if (isCartItem(key)) {
      result.push(key);
    }
  }

  return result;
}

export function clearCart(): void {
  for (let key in localStorage) {
    if (isCartItem(key)) {
      localStorage.removeItem(key)
    }
  }
}

export function removeCartItem(itemKey: string): void {
  localStorage.removeItem(itemKey)
}