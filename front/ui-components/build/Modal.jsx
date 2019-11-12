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
var Modal_1 = __importDefault(require("semantic-ui-react/dist/commonjs/modules/Modal/Modal"));
var styled_components_1 = __importDefault(require("styled-components"));
var Shared_styles_1 = require("./Shared.styles");
var StyledModal = styled_components_1.default(Modal_1.default)(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  &&& {\n    position: ", ";\n    bottom: ", ";\n    right: ", ";\n  }\n"], ["\n  &&& {\n    position: ", ";\n    bottom: ", ";\n    right: ", ";\n  }\n"])), function (props) { return props.position || 'relative'; }, function (props) { return props.bottom || undefined; }, function (props) { return props.right || undefined; });
var StyledContent = styled_components_1.default(Modal_1.default.Content)(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  &&& {\n    display: flex;\n    align-items: ", ";\n    justify-content: ", ";\n    min-width: 100%;\n  }\n"], ["\n  &&& {\n    display: flex;\n    align-items: ", ";\n    justify-content: ", ";\n    min-width: 100%;\n  }\n"])), function (props) { return props.alignItems || 'center'; }, function (props) { return props.justifyContent || 'center'; });
var StyledActions = styled_components_1.default(StyledContent)(templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  margin-top: 2rem;\n"], ["\n  margin-top: 2rem;\n"])));
// FIXME: this component is reused here and in @polkadot/apps - should be moved to @polkadot/ui
function Modal(props) {
    return (<StyledModal {...props}/>);
}
exports.Modal = Modal;
Modal.Actions = StyledActions;
Modal.Content = StyledContent;
Modal.Header = Shared_styles_1.Header;
Modal.SubHeader = Shared_styles_1.SubHeader;
Modal.FadedText = Shared_styles_1.FadedText;
Modal.Description = Modal_1.default.Description;
var templateObject_1, templateObject_2, templateObject_3;
