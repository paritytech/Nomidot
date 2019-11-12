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
var Container_1 = __importDefault(require("semantic-ui-react/dist/commonjs/elements/Container"));
var Dropdown_1 = __importDefault(require("semantic-ui-react/dist/commonjs/modules/Dropdown"));
var Input_1 = __importDefault(require("semantic-ui-react/dist/commonjs/elements/Input"));
var constants_1 = require("./constants");
var globalStyle_1 = require("./globalStyle");
// FIXME: customize as needed
exports.Dropdown = styled_components_1.default(Dropdown_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), globalStyle_1.substrateLightTheme.black);
exports.Input = styled_components_1.default(Input_1.default)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  width: ", "\n"], ["\n  width: ", "\n"])), function (props) { return props.width || '100%'; });
exports.Container = styled_components_1.default(Container_1.default)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  padding: ", ";\n"], ["\n  padding: ", ";\n"])), constants_1.MARGIN_SIZES.large);
/**
 * Fixed-width container
 */
exports.FixedWidthContainer = styled_components_1.default(exports.Container)(templateObject_4 || (templateObject_4 = __makeTemplateObject(["\n  @media only screen and (min-width: 320px) and (max-width: 479px){\n    width: 300px;\n  }\n\n  @media only screen and (min-width: 480px) and (max-width: 767px){\n    width: 400px;\n  }\n\n  @media only screen and (min-width: 768px) and (max-width: 991px){\n    width: 700px;\n  }\n\n  @media only screen and (min-width: 992px){\n    width: 950px;\n  }\n"], ["\n  @media only screen and (min-width: 320px) and (max-width: 479px){\n    width: 300px;\n  }\n\n  @media only screen and (min-width: 480px) and (max-width: 767px){\n    width: 400px;\n  }\n\n  @media only screen and (min-width: 768px) and (max-width: 991px){\n    width: 700px;\n  }\n\n  @media only screen and (min-width: 992px){\n    width: 950px;\n  }\n"])));
exports.BoldText = styled_components_1.default.b(templateObject_5 || (templateObject_5 = __makeTemplateObject(["\n  color: ", ";\n"], ["\n  color: ", ";\n"])), globalStyle_1.substrateLightTheme.black);
exports.FadedText = styled_components_1.default.p(templateObject_6 || (templateObject_6 = __makeTemplateObject(["\n  color: ", ";\n  opacity: 0.5;\n  text-align: center;\n"], ["\n  color: ", ";\n  opacity: 0.5;\n  text-align: center;\n"])), globalStyle_1.substrateLightTheme.black);
exports.FlexItem = styled_components_1.default.div(templateObject_7 || (templateObject_7 = __makeTemplateObject(["\n  flex: ", ";\n"], ["\n  flex: ", ";\n"])), function (props) { return props.flex || 1; });
exports.ErrorText = styled_components_1.default.p(templateObject_8 || (templateObject_8 = __makeTemplateObject(["\n  color: red;\n  text-align: center;\n  font-weight: 500;\n"], ["\n  color: red;\n  text-align: center;\n  font-weight: 500;\n"])));
exports.SuccessText = styled_components_1.default.p(templateObject_9 || (templateObject_9 = __makeTemplateObject(["\n  color: green;\n  text-align: center;\n  font-weight: 500;\n"], ["\n  color: green;\n  text-align: center;\n  font-weight: 500;\n"])));
exports.WithSpace = styled_components_1.default.div(templateObject_10 || (templateObject_10 = __makeTemplateObject(["\n  margin: ", " auto;\n"], ["\n  margin: ", " auto;\n"])), constants_1.MARGIN_SIZES.medium);
exports.WithSpaceAround = styled_components_1.default.div(templateObject_11 || (templateObject_11 = __makeTemplateObject(["\n  margin: ", ";\n  padding: ", ";\n"], ["\n  margin: ", ";\n  padding: ", ";\n"])), function (props) { return constants_1.MARGIN_SIZES[props.margin || 'medium']; }, function (props) { return constants_1.MARGIN_SIZES[props.padding || 'medium']; });
exports.WithSpaceBetween = styled_components_1.default.div(templateObject_12 || (templateObject_12 = __makeTemplateObject(["\n  display: flex ", ";\n  justify-content: space-between;\n  align-items: space-between;\n"], ["\n  display: flex ", ";\n  justify-content: space-between;\n  align-items: space-between;\n"])), function (props) { return props.flexDirection || 'row'; });
exports.WithPadding = styled_components_1.default.div(templateObject_13 || (templateObject_13 = __makeTemplateObject(["\n  padding: ", " auto;\n"], ["\n  padding: ", " auto;\n"])), constants_1.MARGIN_SIZES.medium);
exports.Header = styled_components_1.default.h2(templateObject_14 || (templateObject_14 = __makeTemplateObject(["\n  color: ", ";\n  font-weight: 300;\n  font-size: ", ";\n  margin: ", ";\n  padding: ", " ", ";\n  text-align: ", ";\n"], ["\n  color: ", ";\n  font-weight: 300;\n  font-size: ", ";\n  margin: ", ";\n  padding: ", " ", ";\n  text-align: ", ";\n"])), function (props) { return props.color ? globalStyle_1.substrateLightTheme[props.color] : globalStyle_1.substrateLightTheme.grey; }, constants_1.FONT_SIZES.big, function (props) { return props.margin ? constants_1.MARGIN_SIZES[props.margin] : constants_1.MARGIN_SIZES.big + " 0"; }, constants_1.MARGIN_SIZES.small, constants_1.MARGIN_SIZES.medium, function (props) { return props.textAlign || 'center'; });
exports.DynamicSizeText = styled_components_1.default.p(templateObject_15 || (templateObject_15 = __makeTemplateObject(["\n  font-size: ", ";\n  font-weight: ", ";\n  margin: 0 0;\n  text-align: center;\n"], ["\n  font-size: ", ";\n  font-weight: ", ";\n  margin: 0 0;\n  text-align: center;\n"])), function (props) { return constants_1.FONT_SIZES[props.fontSize || 'medium']; }, function (props) { return props.fontWeight || 'light'; });
exports.RefreshButton = styled_components_1.default.button(templateObject_16 || (templateObject_16 = __makeTemplateObject(["\n  border: none;\n  background-color: inherit;\n  color: ", ";\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n"], ["\n  border: none;\n  background-color: inherit;\n  color: ", ";\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n"])), globalStyle_1.substrateLightTheme.lightBlue1, globalStyle_1.substrateLightTheme.darkBlue);
exports.StyledNavLink = styled_components_1.default.span(templateObject_17 || (templateObject_17 = __makeTemplateObject(["\n  background: none;\n  border: none;\n  color: ", ";\n  font-size: ", ";\n  font-weight: 300;\n\n  :hover {\n    cursor: pointer;\n  }\n"], ["\n  background: none;\n  border: none;\n  color: ", ";\n  font-size: ", ";\n  font-weight: 300;\n\n  :hover {\n    cursor: pointer;\n  }\n"])), function (props) { return props.inverted ? globalStyle_1.substrateLightTheme.white : globalStyle_1.substrateLightTheme.lightBlue2; }, constants_1.FONT_SIZES.medium);
exports.StyledLinkButton = styled_components_1.default.button(templateObject_18 || (templateObject_18 = __makeTemplateObject(["\n  align-items: space-between;\n  background: none;\n  border: none;\n  color: ", ";\n  display: flex;\n  font-size: ", ";\n  font-weight: 300;\n  justify-content: space-between;\n\n  :hover {\n    cursor: pointer;\n  }\n"], ["\n  align-items: space-between;\n  background: none;\n  border: none;\n  color: ", ";\n  display: flex;\n  font-size: ", ";\n  font-weight: 300;\n  justify-content: space-between;\n\n  :hover {\n    cursor: pointer;\n  }\n"])), function (props) { return props.color || globalStyle_1.substrateLightTheme.lightBlue2; }, constants_1.FONT_SIZES.medium);
exports.StyledNavButton = styled_components_1.default.button(templateObject_19 || (templateObject_19 = __makeTemplateObject(["\n  background-image: linear-gradient(\n    107deg,\n    ", ",\n    ", "\n  );\n  border: none;\n  border-radius: 15px;\n  box-shadow: 0 4px 6px 0 rgba(", ", 0.3);\n  color: ", ";\n  fontSize: ", ";\n  height: 42px;\n  width: 134px;\n\n  :hover {\n    cursor: ", ";\n  }\n"], ["\n  background-image: linear-gradient(\n    107deg,\n    ", ",\n    ", "\n  );\n  border: none;\n  border-radius: 15px;\n  box-shadow: 0 4px 6px 0 rgba(", ", 0.3);\n  color: ", ";\n  fontSize: ", ";\n  height: 42px;\n  width: 134px;\n\n  :hover {\n    cursor: ", ";\n  }\n"])), function (props) { return props.disabled ? globalStyle_1.substrateLightTheme.grey : props.negative ? globalStyle_1.substrateLightTheme.orangeYellow : globalStyle_1.substrateLightTheme.lightBlue1; }, function (props) { return props.disabled ? globalStyle_1.substrateLightTheme.grey : props.negative ? globalStyle_1.substrateLightTheme.redOrange : globalStyle_1.substrateLightTheme.neonBlue; }, globalStyle_1.substrateLightTheme.black, globalStyle_1.substrateLightTheme.white, constants_1.FONT_SIZES.large, function (props) { return props.disabled ? 'not-allowed' : 'pointer'; });
exports.VoteNayButton = styled_components_1.default.button(templateObject_20 || (templateObject_20 = __makeTemplateObject(["\nbackground-image: linear-gradient(\n    107deg,\n    ", ",\n    ", "\n  );\n  border: none;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px 0 rgba(", ", 0.3);\n  color: ", ";\n  fontSize: ", ";\n  height: 21px;\n  width: 51px;\n\n  :hover {\n    cursor: pointer;\n  }\n"], ["\nbackground-image: linear-gradient(\n    107deg,\n    ", ",\n    ", "\n  );\n  border: none;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px 0 rgba(", ", 0.3);\n  color: ", ";\n  fontSize: ", ";\n  height: 21px;\n  width: 51px;\n\n  :hover {\n    cursor: pointer;\n  }\n"])), globalStyle_1.substrateLightTheme.hotPink, globalStyle_1.substrateLightTheme.electricPurple, globalStyle_1.substrateLightTheme.black, globalStyle_1.substrateLightTheme.white, constants_1.FONT_SIZES.large);
exports.VoteYayButton = styled_components_1.default.button(templateObject_21 || (templateObject_21 = __makeTemplateObject(["\nbackground-image: linear-gradient(\n    107deg,\n    ", ",\n    ", "\n  );\n  border: none;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px 0 rgba(", ", 0.3);\n  color: ", ";\n  fontSize: ", ";\n  height: 21px;\n  width: 51px;\n\n  :hover {\n    cursor: pointer;\n  }\n"], ["\nbackground-image: linear-gradient(\n    107deg,\n    ", ",\n    ", "\n  );\n  border: none;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px 0 rgba(", ", 0.3);\n  color: ", ";\n  fontSize: ", ";\n  height: 21px;\n  width: 51px;\n\n  :hover {\n    cursor: pointer;\n  }\n"])), globalStyle_1.substrateLightTheme.lightBlue1, globalStyle_1.substrateLightTheme.lightBlue2, globalStyle_1.substrateLightTheme.black, globalStyle_1.substrateLightTheme.white, constants_1.FONT_SIZES.large);
exports.Stacked = styled_components_1.default.div(templateObject_22 || (templateObject_22 = __makeTemplateObject(["\n  align-items: ", ";\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  justify-content: ", ";\n  text-align: ", ";\n"], ["\n  align-items: ", ";\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  justify-content: ", ";\n  text-align: ", ";\n"])), function (props) { return props.alignItems || 'center'; }, function (props) { return props.justifyContent || 'center'; }, function (props) { return props.textAlign || 'center'; });
exports.StackedHorizontal = styled_components_1.default.div(templateObject_23 || (templateObject_23 = __makeTemplateObject(["\n  align-items: ", ";\n  display: flex;\n  flex: 1;\n  flex-direction: row;\n  margin: ", "\n  justify-content: ", ";\n  text-align: ", ";\n"], ["\n  align-items: ", ";\n  display: flex;\n  flex: 1;\n  flex-direction: row;\n  margin: ", "\n  justify-content: ", ";\n  text-align: ", ";\n"])), function (props) { return props.alignItems || 'center'; }, function (props) { return props.margin || 0; }, function (props) { return props.justifyContent || 'center'; }, function (props) { return props.textAlign || 'center'; });
exports.SubHeader = styled_components_1.default.h3(templateObject_24 || (templateObject_24 = __makeTemplateObject(["\n  color: ", ";\n  font-weight: 600;\n  font-size: ", ";\n  margin: ", ";\n  text-align: ", ";\n"], ["\n  color: ", ";\n  font-weight: 600;\n  font-size: ", ";\n  margin: ", ";\n  text-align: ", ";\n"])), globalStyle_1.substrateLightTheme.lightBlue2, constants_1.FONT_SIZES.medium, function (props) { return props.noMargin ? '0 0' : '1rem auto 0.3rem auto'; }, function (props) { return props.textAlign || 'center'; });
exports.InlineSubHeader = styled_components_1.default(exports.SubHeader)(templateObject_25 || (templateObject_25 = __makeTemplateObject(["\n  display: inline;\n"], ["\n  display: inline;\n"])));
exports.WrapperDiv = styled_components_1.default.div(templateObject_26 || (templateObject_26 = __makeTemplateObject(["\n  margin: ", ";\n  padding: ", ";\n  width: ", ";\n  height: ", ";\n"], ["\n  margin: ", ";\n  padding: ", ";\n  width: ", ";\n  height: ", ";\n"])), function (props) { return props.margin || '1rem'; }, function (props) { return props.padding || '1rem'; }, function (props) { return props.width || '30rem'; }, function (props) { return props.height || '100%'; });
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13, templateObject_14, templateObject_15, templateObject_16, templateObject_17, templateObject_18, templateObject_19, templateObject_20, templateObject_21, templateObject_22, templateObject_23, templateObject_24, templateObject_25, templateObject_26;
