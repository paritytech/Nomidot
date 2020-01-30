// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

// FIXME: UI utils should be reused from @polkadot-js/ui, once it's there
export default function toShortAddress(
  _address?: AccountId | AccountIndex | Address | string | null
): string {
  const address = (_address || '').toString();

  return address.length > 15
    ? `${address.slice(0, 7)}…${address.slice(-7)}`
    : address;
}
