"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Button_1 = __importDefault(require("semantic-ui-react/dist/commonjs/elements/Button"));
var styled_components_1 = __importDefault(require("styled-components"));
var globalStyle_1 = require("./globalStyle");
var Icon_1 = require("./Icon");
var SUIFab = styled_components_1.default(Button_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  &&& {\n    background-image: ", ";\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    text-align: center;\n    vertical-align: center;\n    color: white;\n    height: ", ";\n    width: ", ";\n    box-shadow: '0 6px 6px 0 rgba(0, 0, 0, 0.24), 0 0 6px 0 rgba(0, 0, 0, 0.12)';\n    border-radius: 50%;\n    position: fixed;\n    bottom: 5rem;\n    right: 5rem;\n  }\n"], ["\n  &&& {\n    background-image: ",
    ";\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    text-align: center;\n    vertical-align: center;\n    color: white;\n    height: ", ";\n    width: ", ";\n    box-shadow: '0 6px 6px 0 rgba(0, 0, 0, 0.24), 0 0 6px 0 rgba(0, 0, 0, 0.12)';\n    border-radius: 50%;\n    position: fixed;\n    bottom: 5rem;\n    right: 5rem;\n  }\n"])), "linear-gradient(\n      107deg,\n      " + globalStyle_1.substrateLightTheme.lightBlue1 + ",\n      " + globalStyle_1.substrateLightTheme.neonBlue + "\n    )", function (props) { return props.height || '4rem'; }, function (props) { return props.width || '4rem'; });
function Fab(props) {
    return (<SUIFab {...props}>
      {props.type === 'add'
        ? <Icon_1.Icon name='add' color='white' size='large' style={{ marginLeft: '8px' }}/>
        : <Icon_1.Icon name='send' color='white' size='large' style={{ marginLeft: '3.9px' }}/>}
    </SUIFab>);
}
exports.Fab = Fab;
var templateObject_1;
