"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
// FIXME: UI utils should be reused from @polkadot-js/ui, once it's there
function toShortAddress(_address) {
    var address = (_address || '').toString();
    return (address.length > 15)
        ? address.slice(0, 7) + "\u2026" + address.slice(-7)
        : address;
}
exports.default = toShortAddress;
