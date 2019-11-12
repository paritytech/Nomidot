"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@polkadot/util");
var Either_1 = require("fp-ts/lib/Either");
var Option_1 = require("fp-ts/lib/Option");
var AddressType;
(function (AddressType) {
    AddressType[AddressType["Account"] = 0] = "Account";
    AddressType[AddressType["Address"] = 1] = "Address";
})(AddressType || (AddressType = {}));
/**
 * Helper function for the 2 functions below
 */
function keyringHelper(type, keyring, address) {
    // Which keyring function to call?
    var keyringFunction = type === AddressType.Account
        ? function (addr) { return keyring.getAccount(addr); }
        : function (addr) { return keyring.getAddress(addr); };
    return Either_1.fromOption(new Error('You need to specify an address'))(Option_1.fromNullable(address))
        // `keyring.getAddress` might fail: catch and return None if it does, pass on the KeyringAddress otherwise
        .chain(function (addr) { return Either_1.tryCatch2v(function () { return keyringFunction(addr); }, function (e) { return e; }); })
        .chain(function (keyringAddress) { return Either_1.tryCatch2v(function () {
        if (!util_1.isUndefined(keyringAddress)) {
            return keyringAddress;
        }
        throw new Error('The address you are looking for does not exist in keyring');
    }, function (e) { return e; }); });
}
/**
 * From an `account` string, check if it's in the keyring, and returns an
 * Either<Error,KeyringAddress>.
 */
function getKeyringAccount(keyring, account) {
    return keyringHelper(AddressType.Account, keyring, account);
}
exports.getKeyringAccount = getKeyringAccount;
/**
 * From an `address` string, check if it's in the keyring, and returns an
 * Either<Error,KeyringAddress>.
 */
function getKeyringAddress(keyring, address) {
    return keyringHelper(AddressType.Address, keyring, address);
}
exports.getKeyringAddress = getKeyringAddress;
