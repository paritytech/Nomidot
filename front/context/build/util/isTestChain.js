"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
var TEST_CHAINS = ['Development', 'Local Testnet'];
function isTestChain(chain) {
    if (!chain) {
        return false;
    }
    return (TEST_CHAINS).includes(chain);
}
exports.isTestChain = isTestChain;
