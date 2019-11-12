"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var semantic_ui_react_1 = require("semantic-ui-react");
function Loading(props) {
    var active = props.active, children = props.children, _a = props.inline, inline = _a === void 0 ? false : _a, _b = props.inverted, inverted = _b === void 0 ? false : _b;
    return (<react_1.default.Fragment>
      <semantic_ui_react_1.Dimmer active={active}>
        <semantic_ui_react_1.Loader active={active} inline={inline} inverted={inverted}>
          {children}
        </semantic_ui_react_1.Loader>
      </semantic_ui_react_1.Dimmer>
    </react_1.default.Fragment>);
}
exports.Loading = Loading;
