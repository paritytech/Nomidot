"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Progress_1 = __importDefault(require("semantic-ui-react/dist/commonjs/modules/Progress/Progress"));
function Progress(props) {
    var _a = props.color, color = _a === void 0 ? 'blue' : _a, disabled = props.disabled, percent = props.percent, size = props.size;
    return (<Progress_1.default color={color} disabled={disabled} percent={percent} size={size}/>);
}
exports.Progress = Progress;
