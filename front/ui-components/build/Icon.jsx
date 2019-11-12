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
var Icon_1 = __importDefault(require("semantic-ui-react/dist/commonjs/elements/Icon/Icon"));
var globalStyle_1 = require("./globalStyle");
exports.Icon = styled_components_1.default(Icon_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  &&& {\n    color: ", "\n    )\n  }"], ["\n  &&& {\n    color: ", "\n    )\n  }"])), globalStyle_1.substrateLightTheme.neonBlue);
var templateObject_1;
