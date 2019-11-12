"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_identicon_1 = __importDefault(require("@polkadot/react-identicon"));
var react_1 = __importDefault(require("react"));
var _1 = require("./");
function smallIcon(address) {
    return <_1.Margin as='span' left='small' right='small' top='small'>
    <react_identicon_1.default theme='substrate' size={16} value={address}/>
  </_1.Margin>;
}
function TxSummary(_a) {
    var amount = _a.amount, methodCall = _a.methodCall, recipientAddress = _a.recipientAddress, senderAddress = _a.senderAddress, _b = _a.tokenSymbol, tokenSymbol = _b === void 0 ? _1.DEFAULT_TOKEN_SYMBOL : _b;
    return (<_1.StackedHorizontal>
      {methodCall} {amount.toString()} {tokenSymbol} from
      {smallIcon(senderAddress)}
      {recipientAddress && (<react_1.default.Fragment>to {smallIcon(recipientAddress)}</react_1.default.Fragment>)}
    </_1.StackedHorizontal>);
}
exports.TxSummary = TxSummary;
