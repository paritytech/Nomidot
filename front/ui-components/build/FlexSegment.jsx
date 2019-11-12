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
var Segment_1 = __importDefault(require("semantic-ui-react/dist/commonjs/elements/Segment"));
var styled_components_1 = __importDefault(require("styled-components"));
var globalStyle_1 = require("./globalStyle");
exports.FlexSegment = styled_components_1.default(Segment_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  &&& {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: ", ";\n    width: ", ";\n    margin: 0.3rem auto;\n    box-shadow: 0 2px 2px 0 rgba(", ", 0.3);\n    background-color: ", ";\n  }\n"], ["\n  &&& {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: ", ";\n    width: ", ";\n    margin: 0.3rem auto;\n    box-shadow: 0 2px 2px 0 rgba(", ", 0.3);\n    background-color: ", ";\n  }\n"])), function (props) { return props.height || '3rem'; }, function (props) { return props.width || '80%'; }, globalStyle_1.substrateLightTheme.black, function (props) { return props.backgroundColor || globalStyle_1.substrateLightTheme.white; });
var templateObject_1;
