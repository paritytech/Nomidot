"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Shared_styles_1 = require("./Shared.styles");
function NavButton(props) {
    var children = props.children, _a = props.fontSize, fontSize = _a === void 0 ? 'medium' : _a, _b = props.fontWeight, fontWeight = _b === void 0 ? '300' : _b, value = props.value, rest = __rest(props, ["children", "fontSize", "fontWeight", "value"]);
    return (<Shared_styles_1.StyledNavButton {...rest}>
      <Shared_styles_1.DynamicSizeText fontSize={fontSize} fontWeight={fontWeight}>
        {value || children}
      </Shared_styles_1.DynamicSizeText>
    </Shared_styles_1.StyledNavButton>);
}
exports.NavButton = NavButton;
