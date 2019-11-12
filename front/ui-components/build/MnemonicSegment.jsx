"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var _1 = require("./");
function MnemonicSegment(props) {
    var mnemonic = props.mnemonic, onClick = props.onClick;
    return (<_1.FlexSegment>
      <_1.FadedText style={{ margin: '0 auto' }}> {mnemonic} </_1.FadedText>
      <_1.RefreshButton>
        <_1.Icon onClick={onClick} name='refresh'/>
      </_1.RefreshButton>
    </_1.FlexSegment>);
}
exports.MnemonicSegment = MnemonicSegment;
