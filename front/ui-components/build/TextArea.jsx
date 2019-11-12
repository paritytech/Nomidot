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
var TextArea_1 = __importDefault(require("semantic-ui-react/dist/commonjs/addons/TextArea"));
function TextArea(props) {
    var placeholder = props.placeholder, rows = props.rows, value = props.value;
    return (<semantic_ui_react_1.Form>
      <TextArea_1.default placeholder={placeholder} rows={rows} style={{ minHeight: '100px' }} value={value}/>
    </semantic_ui_react_1.Form>);
}
exports.TextArea = TextArea;
