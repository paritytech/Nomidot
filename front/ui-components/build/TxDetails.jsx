"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
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
var react_1 = __importDefault(require("react"));
var _1 = require("./");
function panels(_a) {
    var allFees = _a.allFees, allTotal = _a.allTotal, amount = _a.amount, recipientAddress = _a.recipientAddress, senderAddress = _a.senderAddress, tokenSymbol = _a.tokenSymbol;
    var symbol = tokenSymbol || _1.DEFAULT_TOKEN_SYMBOL;
    return [{
            key: 'details',
            title: {
                content: 'View details'
            },
            content: {
                content: <_1.Stacked alignItems='flex-start'>
        <_1.SubHeader noMargin>Sender Account:</_1.SubHeader>
        <p>{senderAddress}</p>
        <_1.SubHeader noMargin>Recipient Address:</_1.SubHeader>
        <p>{recipientAddress}</p>
        <_1.SubHeader noMargin>Transfer Amount:</_1.SubHeader>
        <p>{amount.toString()} {symbol}</p>
        <_1.SubHeader noMargin>Fees:</_1.SubHeader>
        <p>{allFees.toString()} {symbol}</p>
        <_1.SubHeader noMargin>Total Amount (amount + fees):</_1.SubHeader>
        <p>{allTotal.toString()} {symbol}</p>
      </_1.Stacked>
            }
        }];
}
function TxDetails(_a) {
    var allFees = _a.allFees, allTotal = _a.allTotal, amount = _a.amount, recipientAddress = _a.recipientAddress, senderAddress = _a.senderAddress, tokenSymbol = _a.tokenSymbol, rest = __rest(_a, ["allFees", "allTotal", "amount", "recipientAddress", "senderAddress", "tokenSymbol"]);
    return (<_1.Accordion panels={panels({ allFees: allFees, allTotal: allTotal, amount: amount, recipientAddress: recipientAddress, senderAddress: senderAddress, tokenSymbol: tokenSymbol })} {...rest}/>);
}
exports.TxDetails = TxDetails;
