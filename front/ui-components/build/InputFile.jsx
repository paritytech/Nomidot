"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
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
var react_dropzone_1 = require("react-dropzone");
var styled_components_1 = __importDefault(require("styled-components"));
var defaultAccept = ['application/json, text/plain'].join(',');
var getColor = function (props) {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
};
var Container = styled_components_1.default('div')(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  align-items: center;\n  border-width: 2px;\n  border-radius: 2px;\n  border-color: ", ";\n  border-style: dashed;\n  background-color: #fafafa;\n  color: #bdbdbd;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  outline: none;\n  padding: 100px;\n  transition: border .24s ease-in-out;\n"], ["\n  align-items: center;\n  border-width: 2px;\n  border-radius: 2px;\n  border-color: ", ";\n  border-style: dashed;\n  background-color: #fafafa;\n  color: #bdbdbd;\n  display: flex;\n  flex: 1;\n  flex-direction: column;\n  outline: none;\n  padding: 100px;\n  transition: border .24s ease-in-out;\n"])), function (props) { return getColor(props); });
function InputFile(props) {
    var onDrop = react_1.useCallback(function (acceptedFiles) {
        var reader = new FileReader();
        reader.onabort = function () { return console.log('file reading was aborted'); };
        reader.onerror = function () { return console.log('file reading has failed'); };
        reader.onload = function () {
            props.onChange && props.onChange(reader.result);
        };
        acceptedFiles.forEach(function (file) { return reader.readAsBinaryString(file); });
    }, [props]);
    var _a = react_dropzone_1.useDropzone({ accept: defaultAccept, onDrop: onDrop }), getRootProps = _a.getRootProps, getInputProps = _a.getInputProps, isDragActive = _a.isDragActive, isDragAccept = _a.isDragAccept, isDragReject = _a.isDragReject;
    return (<div className='container'>
      <Container {...getRootProps({ isDragActive: isDragActive, isDragAccept: isDragAccept, isDragReject: isDragReject })}>
        <input {...getInputProps()}/>
        <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
      </Container>
    </div>);
}
exports.InputFile = InputFile;
var templateObject_1;
