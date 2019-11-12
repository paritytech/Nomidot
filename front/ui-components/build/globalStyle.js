"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var styled_components_1 = require("styled-components");
exports.GlobalStyle = styled_components_1.createGlobalStyle(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  html {\n    height: 100%;\n  }\n\n  body {\n    height: 100%;\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    margin: 0;\n    padding: 0;\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',\n      'Droid Sans', 'Helvetica Neue', sans-serif;\n    -webkit-font-smoothing: antialiased;\n  }\n"], ["\n  html {\n    height: 100%;\n  }\n\n  body {\n    height: 100%;\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    margin: 0;\n    padding: 0;\n    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans',\n      'Droid Sans', 'Helvetica Neue', sans-serif;\n    -webkit-font-smoothing: antialiased;\n  }\n"])));
// ordered darkest to lightest
exports.substrateLightTheme = {
    black: '#222',
    grey: '#888',
    redOrange: '#ff3400',
    coral: '#ff5d3e',
    tangerine: '#f68a04',
    orangeYellow: '#ffae00',
    hotPink: '#ff008d',
    electricPurple: '#a030ec',
    purple: '#8479f3',
    darkBlue: '#5c53fc',
    lightBlue2: '#51a0ec',
    lightBlue1: '#53a0fd',
    neonBlue: '#0ed2f7',
    robinEggBlue: '#86fff9',
    eggShell: '#f2f2f2',
    white: '#ffffff'
};
var templateObject_1;
