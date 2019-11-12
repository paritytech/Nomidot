"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// FIXME I'm not sure having stateful components/functions inside ui-components
// is a good idea, everything here should be dumb/stateless
var ui_keyring_1 = __importDefault(require("@polkadot/ui-keyring"));
var util_1 = require("@polkadot/util");
// FIXME: UI utils should be reused from @polkadot-js/ui, once it's there
function toAddress(value) {
    if (!value) {
        return;
    }
    try {
        return ui_keyring_1.default.encodeAddress(util_1.isHex(value)
            ? util_1.hexToU8a(value)
            : ui_keyring_1.default.decodeAddress(value));
    }
    catch (error) {
        console.error('Unable to encode address', value);
    }
}
exports.default = toAddress;
