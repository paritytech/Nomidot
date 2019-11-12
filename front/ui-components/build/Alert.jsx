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
var semantic_ui_react_1 = require("semantic-ui-react");
var styled_components_1 = __importDefault(require("styled-components"));
var colors = {
    error: function (props) { return [props.theme.redOrange, props.theme.coral]; },
    info: function (props) { return [props.theme.robinEggBlue, props.theme.neonBlue]; },
    success: function (props) { return [props.theme.lightBlue1, props.theme.purple]; },
    warning: function (props) { return [props.theme.orangeYellow, props.theme.tangerine]; }
};
/**
 * Alert Bar CSS Gradients have 2 colors, get the color at index `index`.
 * @param index - The index of the gradient color.
 */
function gradientColor(index) {
    return function (props) {
        // Check if props.{error, info, warning} is set.
        var alertType = ['error', 'info', 'warning'].find(function (type) { return props[type]; });
        if (alertType) {
            return colors[alertType](props)[index];
        }
        // By default we return the success gradient
        return colors.success(props)[index];
    };
}
exports.Alert = styled_components_1.default(semantic_ui_react_1.Message)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  &&& {\n    background-image: linear-gradient(\n      107deg,\n      ", ",\n      ", " 71%\n    );\n    bottom: 0;\n    left: 0;\n    box-shadow: none;\n    color: ", ";\n    padding-bottom: 2rem;\n    padding-left: 4rem;\n    padding-right: 6rem;\n    position: fixed;\n    width: 100%;\n  }\n"], ["\n  &&& {\n    background-image: linear-gradient(\n      107deg,\n      ", ",\n      ", " 71%\n    );\n    bottom: 0;\n    left: 0;\n    box-shadow: none;\n    color: ", ";\n    padding-bottom: 2rem;\n    padding-left: 4rem;\n    padding-right: 6rem;\n    position: fixed;\n    width: 100%;\n  }\n"])), gradientColor(0), gradientColor(1), function (props) { return props.theme.white; });
var templateObject_1;
