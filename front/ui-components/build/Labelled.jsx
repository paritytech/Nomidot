"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Label_1 = __importDefault(require("semantic-ui-react/dist/commonjs/elements/Label/Label"));
var index_1 = require("./index");
function Labelled(props) {
    var children = props.children, _a = props.isHidden, isHidden = _a === void 0 ? false : _a, label = props.label, _b = props.withLabel, withLabel = _b === void 0 ? false : _b;
    if (isHidden) {
        return null;
    }
    return (<index_1.StackedHorizontal justifyContent='space-around'>
      {withLabel && <Label_1.default>{label}</Label_1.default>}
      {children}
    </index_1.StackedHorizontal>);
}
exports.Labelled = Labelled;
