"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var index_1 = require("./index");
function WalletCard(props) {
    var children = props.children, header = props.header, height = props.height, _a = props.overflow, overflow = _a === void 0 ? 'none' : _a, subheader = props.subheader;
    return (<index_1.Card height={height} raised overflow={overflow}>
      <index_1.WithSpaceAround>
        <index_1.Stacked>
          <index_1.Header margin='large'> {header} </index_1.Header>
          <index_1.SubHeader margin='large'> {subheader} </index_1.SubHeader>
          <index_1.Stacked>
            {children}
          </index_1.Stacked>
        </index_1.Stacked>
      </index_1.WithSpaceAround>
    </index_1.Card>);
}
exports.WalletCard = WalletCard;
