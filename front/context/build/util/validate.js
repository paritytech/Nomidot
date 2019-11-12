"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@polkadot/util");
var bn_js_1 = __importDefault(require("bn.js"));
var Either_1 = require("fp-ts/lib/Either");
var Option_1 = require("fp-ts/lib/Option");
var MAX_SIZE_MB = 10;
var MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
var LENGTH_PUBLICKEY = 32 + 1; // publicKey + prefix
var LENGTH_SIGNATURE = 64;
var LENGTH_ERA = 1;
var SIGNATURE_SIZE = LENGTH_PUBLICKEY + LENGTH_SIGNATURE + LENGTH_ERA;
/**
 * Make sure the amount (as a BN) is correct.
 */
function validateAmount(values) {
    var amountAsString = values.amountAsString, rest = __rest(values, ["amountAsString"]);
    var amount = new bn_js_1.default(amountAsString);
    if (amount.isNeg()) {
        return Either_1.left({ amount: 'Please enter a positive amount to transfer.' });
    }
    if (amount.isZero()) {
        return Either_1.left({ amount: 'Please make sure you are sending more than 0 balance.' });
    }
    return Either_1.right(__assign({ amount: amount }, rest));
}
/**
 * Make sure derived validations (fees, minimal amount) are correct.
 * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L63-L111
 */
function validateDerived(values) {
    var accountNonce = values.accountNonce, _a = values.amount, amount = _a === void 0 ? new bn_js_1.default(0) : _a, currentBalance = values.currentBalance, extrinsic = values.extrinsic, fees = values.fees, recipientBalance = values.recipientBalance;
    var txLength = SIGNATURE_SIZE + util_1.compactToU8a(accountNonce).length + extrinsic.encodedLength;
    var allFees = fees.transactionBaseFee.add(fees.transactionByteFee.muln(txLength));
    var isCreation = false;
    var isNoEffect = false;
    if (recipientBalance !== undefined) {
        isCreation = recipientBalance.votingBalance.isZero() && fees.creationFee.gtn(0);
        isNoEffect = amount.add(recipientBalance.votingBalance).lte(fees.existentialDeposit);
    }
    var allTotal = amount.add(allFees).add(isCreation ? fees.creationFee : new bn_js_1.default(0));
    var hasAvailable = currentBalance.freeBalance.gte(allTotal);
    var isRemovable = currentBalance.votingBalance.sub(allTotal).lte(fees.existentialDeposit);
    var isReserved = currentBalance.freeBalance.isZero() && currentBalance.reservedBalance.gtn(0);
    var overLimit = txLength >= MAX_SIZE_BYTES;
    var errors = {};
    if (!hasAvailable) {
        errors.amount = 'The selected account does not have the required balance available for this transaction.';
    }
    if (overLimit) {
        errors.amount = "This transaction will be rejected by the node as it is greater than the maximum size of " + MAX_SIZE_MB + "MB.";
    }
    return Object.keys(errors).length
        ? Either_1.left(errors)
        : Either_1.right(__assign(__assign({}, values), { allFees: allFees,
            allTotal: allTotal,
            hasAvailable: hasAvailable,
            isCreation: isCreation,
            isNoEffect: isNoEffect,
            isRemovable: isRemovable,
            isReserved: isReserved,
            overLimit: overLimit }));
}
exports.validateDerived = validateDerived;
/**
 * Add the extrinsic object, no validation done here.
 */
function validateExtrinsic() {
    return function (values) {
        var extrinsic = values.extrinsic;
        var errors = {};
        if (!extrinsic) {
            // FIXME: code should never reach here
            errors.extrinsic = 'Extrinsic was not defined. Please refresh and try again or raise an issue.';
            Either_1.left(errors);
        }
        return Either_1.right(values);
    };
}
/**
 * Make sure the subscription results are here.
 */
function validateSubResults(values) {
    var accountNonce = values.accountNonce, currentBalance = values.currentBalance, extrinsic = values.extrinsic, fees = values.fees, recipientBalance = values.recipientBalance, rest = __rest(values, ["accountNonce", "currentBalance", "extrinsic", "fees", "recipientBalance"]);
    var errors = {};
    if (!accountNonce) {
        errors.accountNonce = 'Please wait while we fetch your account nonce.';
    }
    if (!fees) {
        errors.fees = 'Please wait while we fetch transfer fees.';
    }
    if (!currentBalance) {
        errors.currentBalance = 'Please wait while we fetch your voting balance.';
    }
    // FIXME: check for more methods as necessary
    if (!recipientBalance && extrinsic && extrinsic.method.methodName === 'transfer') {
        errors.recipientBalance = "Please wait while we fetch the recipient's balance.";
    }
    return Object.keys(errors).length
        ? Either_1.left(errors)
        : Either_1.right(__assign({ accountNonce: accountNonce, currentBalance: currentBalance, extrinsic: extrinsic, fees: fees, recipientBalance: recipientBalance }, rest));
}
/**
 * Make sure everything the user inputted is correct.
 */
function validateUserInputs(values) {
    var amountAsString = values.amountAsString, currentAccount = values.currentAccount, recipientAddress = values.recipientAddress, extrinsic = values.extrinsic, rest = __rest(values, ["amountAsString", "currentAccount", "recipientAddress", "extrinsic"]);
    var errors = {};
    if (!currentAccount) {
        errors.currentAccount = 'Please enter a sender account.';
    }
    // FIXME: check for more methods as necessary
    if (!recipientAddress && extrinsic && extrinsic.method.methodName === 'transfer') {
        errors.recipientAddress = 'Please enter a recipient address.';
    }
    if (currentAccount === recipientAddress) {
        errors.currentAccount = 'You cannot send balance to yourself.';
    }
    if (!amountAsString) {
        errors.amount = 'Please enter an amount';
    }
    return Object.keys(errors).length
        ? Either_1.left(errors)
        : Either_1.right(__assign({ amountAsString: amountAsString, currentAccount: currentAccount, recipientAddress: recipientAddress, extrinsic: extrinsic }, rest));
}
/**
 * Show some warnings, that are not blocking the transaction, but may have
 * undesirable effects for the user.
 * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L158-L168
 */
function validateWarnings(values) {
    var fees = values.fees, hasAvailable = values.hasAvailable, isCreation = values.isCreation, isNoEffect = values.isNoEffect, isRemovable = values.isRemovable, isReserved = values.isReserved;
    var warnings = [];
    if (isRemovable && hasAvailable) {
        warnings.push('Submitting this transaction will drop the account balance to below the existential amount, which can result in the account being removed from the chain state and associated funds burned.');
    }
    if (isNoEffect) {
        warnings.push('The final recipient balance is less than the existential amount and will not be reflected.');
    }
    if (isCreation) {
        warnings.push("A fee of " + fees.creationFee + " will be deducted from the sender since the destination account does not exist.");
    }
    if (isReserved) {
        warnings.push('This account does have a reserved/locked balance, not taken into account');
    }
    return warnings.length > 0 ? Option_1.some(warnings) : Option_1.none;
}
exports.validateWarnings = validateWarnings;
/**
 * Validate everything. The order of validation should be easily readable
 * from the `.chain()` syntax.
 */
function validate(values) {
    return validateUserInputs(values)
        .chain(validateSubResults)
        .chain(validateAmount)
        .chain(validateExtrinsic())
        .chain(validateDerived);
}
exports.validate = validate;
