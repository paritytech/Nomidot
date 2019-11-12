"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var CopyButton_1 = require("./CopyButton");
var FlexSegment_1 = require("./FlexSegment");
function Address(props) {
    var address = props.address, shortened = props.shortened, _a = props.zIndex, zIndex = _a === void 0 ? 0 : _a;
    return (<FlexSegment_1.FlexSegment style={{ zIndex: zIndex }}>
      {shortened
        ? address.slice(0, 8).concat('......').concat(address.slice(address.length - 8, address.length))
        : address}
      <CopyButton_1.CopyButton value={address}/>
    </FlexSegment_1.FlexSegment>);
}
exports.Address = Address;
