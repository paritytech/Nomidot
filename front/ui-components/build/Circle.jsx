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
var styled_components_1 = __importDefault(require("styled-components"));
var globalStyle_1 = require("./globalStyle");
function Circle(props) {
    var fill = props.fill, label = props.label, _a = props.radius, radius = _a === void 0 ? 20 : _a, _b = props.withShadow, withShadow = _b === void 0 ? false : _b;
    var StyledCircle = styled_components_1.default.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    height: ", "px;\n    width: ", "px;\n    background-color: ", ";\n    background-image: ", ";\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    text-align: center;\n    vertical-align: center;\n    box-shadow: ", ";\n  "], ["\n    height: ", "px;\n    width: ", "px;\n    background-color: ", ";\n    background-image: ",
        ";\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    text-align: center;\n    vertical-align: center;\n    box-shadow: ", ";\n  "])), radius, radius, fill, "linear-gradient(\n      107deg,\n      " + globalStyle_1.substrateLightTheme.lightBlue1 + ",\n      " + globalStyle_1.substrateLightTheme.neonBlue + "\n    )", withShadow && '0 6px 6px 0 rgba(0, 0, 0, 0.24), 0 0 6px 0 rgba(0, 0, 0, 0.12)');
    var WhiteText = styled_components_1.default.p(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    color: #ffffff\n  "], ["\n    color: #ffffff\n  "])));
    return (<StyledCircle>
      <WhiteText>{label}</WhiteText>
    </StyledCircle>);
}
exports.Circle = Circle;
var templateObject_1, templateObject_2;
