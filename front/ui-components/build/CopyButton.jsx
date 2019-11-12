"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var react_copy_to_clipboard_1 = __importDefault(require("react-copy-to-clipboard"));
var styled_components_1 = __importDefault(require("styled-components"));
var Icon_1 = require("./Icon");
var Shared_styles_1 = require("./Shared.styles");
var StyledCopyButton = styled_components_1.default.button(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  border: none;\n  background-color: inherit;\n  color: ", ";\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n"], ["\n  border: none;\n  background-color: inherit;\n  color: ", ";\n\n  :hover {\n    cursor: pointer;\n    color: ", ";\n  }\n"])), function (props) { return props.theme.lightBlue1; }, function (props) { return props.theme.darkBlue; });
function CopyButton(props) {
    var value = props.value;
    var _a = __read(react_1.useState(false), 2), copied = _a[0], setCopied = _a[1];
    var handleCopied = function () {
        setCopied(true);
        setTimeout(function () { return setCopied(false); }, 1000);
    };
    return (<react_copy_to_clipboard_1.default text={value || ''} onCopy={handleCopied}>
      <StyledCopyButton>
        <Shared_styles_1.Stacked>
          <Icon_1.Icon name={copied ? 'check' : 'copy'}/>
          {copied && <small> Copied! </small>}
        </Shared_styles_1.Stacked>
      </StyledCopyButton>
    </react_copy_to_clipboard_1.default>);
}
exports.CopyButton = CopyButton;
var templateObject_1;
