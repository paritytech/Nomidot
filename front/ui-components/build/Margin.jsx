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
var styled_components_1 = __importDefault(require("styled-components"));
var constants_1 = require("./constants");
/**
 * Mapping between <Margin />'s size and its CSS value.
 */
function sizeValues(size) {
    switch (size) {
        case true:
            return constants_1.MARGIN_SIZES.medium;
        case 'small':
        case 'medium':
        case 'large':
        case 'big':
        case 'huge':
            return constants_1.MARGIN_SIZES[size];
        default: return '0';
    }
}
/**
 * Get value from prop.
 */
var getMarginValue = function (position) { return function (props) {
    return sizeValues(props[position]);
}; };
exports.Margin = styled_components_1.default.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-bottom: ", "\n  margin-left: ", "\n  margin-right: ", "\n  margin-top: ", "\n"], ["\n  margin-bottom: ", "\n  margin-left: ", "\n  margin-right: ", "\n  margin-top: ", "\n"])), getMarginValue('bottom'), getMarginValue('left'), getMarginValue('right'), getMarginValue('top'));
var templateObject_1;
