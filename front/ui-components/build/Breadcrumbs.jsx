"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Breadcrumb_1 = __importDefault(require("semantic-ui-react/dist/commonjs/collections/Breadcrumb/Breadcrumb"));
var globalStyle_1 = require("./globalStyle");
var index_1 = require("./index");
function Breadcrumbs(props) {
    var activeLabel = props.activeLabel, onClick = props.onClick, sectionLabels = props.sectionLabels, size = props.size;
    return (<Breadcrumb_1.default size={size}>
      <index_1.StackedHorizontal>
        {sectionLabels.map(function (label, idx) {
        var active = activeLabel === label;
        return (<index_1.Margin key={label} left='big'>
                <Breadcrumb_1.default.Section active={active} onClick={onClick}>
                  <index_1.Stacked>
                    <index_1.Circle fill={globalStyle_1.substrateLightTheme.lightBlue1} label={idx.toString()} radius={32} withShadow={active}/>
                    <index_1.Margin top/>
                    <index_1.FadedText>{label}</index_1.FadedText>
                  </index_1.Stacked>
                </Breadcrumb_1.default.Section>
              </index_1.Margin>);
    })}
      </index_1.StackedHorizontal>
    </Breadcrumb_1.default>);
}
exports.Breadcrumbs = Breadcrumbs;
