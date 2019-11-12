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
var Card_1 = __importDefault(require("semantic-ui-react/dist/commonjs/views/Card"));
var styled_components_1 = __importDefault(require("styled-components"));
var StyledCard = styled_components_1.default(Card_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n &&& {\n  background-color: #ffffff;\n  border-radius: 2px;\n  box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);\n  height: ", ";\n  min-height: ", ";\n  width: ", ";\n  overflow: ", ";\n }\n"], ["\n &&& {\n  background-color: #ffffff;\n  border-radius: 2px;\n  box-shadow: 0 4px 5px 1px rgba(0, 0, 0, 0.3);\n  height: ", ";\n  min-height: ", ";\n  width: ", ";\n  overflow: ", ";\n }\n"])), function (props) { return props.height || '357px'; }, function (props) { return props.minHeight || '100%'; }, function (props) { return props.width || '100%'; }, function (props) { return props.overflow || 'none'; });
function Card(props) {
    return (<StyledCard {...props}/>);
}
exports.Card = Card;
Card.Content = Card_1.default.Content;
Card.Description = Card_1.default.Description;
Card.Group = Card_1.default.Group;
Card.Header = Card_1.default.Header;
var templateObject_1;
