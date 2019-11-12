"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_identicon_1 = __importDefault(require("@polkadot/react-identicon"));
var react_1 = __importDefault(require("react"));
var Address_1 = require("../../Address");
var Balance_1 = require("../Balance");
var Margin_1 = require("../../Margin");
var Shared_styles_1 = require("../../Shared.styles");
var PLACEHOLDER_NAME = 'No Name';
var ICON_SIZES = {
    tiny: 16,
    small: 32,
    medium: 64,
    large: 128
};
function renderIcon(address, size) {
    return <react_identicon_1.default value={address} theme={'substrate'} size={ICON_SIZES[size]}/>;
}
var FONT_SIZES = {
    tiny: 'small',
    small: 'medium',
    medium: 'large',
    large: 'big'
};
function renderBadge(type) {
    // FIXME make it an actual badge
    return type === 'nominator' ? <Shared_styles_1.SubHeader>nominator</Shared_styles_1.SubHeader> : <Shared_styles_1.SubHeader>validator</Shared_styles_1.SubHeader>;
}
function renderDetails(address, summaryProps) {
    var bondingPair = summaryProps.bondingPair, detailed = summaryProps.detailed, isNominator = summaryProps.isNominator, isValidator = summaryProps.isValidator, _a = summaryProps.name, name = _a === void 0 ? PLACEHOLDER_NAME : _a, noBalance = summaryProps.noBalance, noPlaceholderName = summaryProps.noPlaceholderName, _b = summaryProps.size, size = _b === void 0 ? 'medium' : _b, type = summaryProps.type, withShortAddress = summaryProps.withShortAddress;
    return (<Shared_styles_1.Stacked>
      <Shared_styles_1.DynamicSizeText fontSize={FONT_SIZES[size]}> {noPlaceholderName ? null : name} </Shared_styles_1.DynamicSizeText>
      {withShortAddress && <Address_1.Address address={address} shortened/>}
      {type && <Shared_styles_1.FadedText> Account Type: {type} </Shared_styles_1.FadedText>}
      {bondingPair && <Shared_styles_1.StackedHorizontal><Shared_styles_1.FadedText> Bonding Pair: </Shared_styles_1.FadedText> {renderIcon(bondingPair, 'tiny')} </Shared_styles_1.StackedHorizontal>}
      {isNominator && renderBadge('nominator')}
      {isValidator && renderBadge('validator')}
      {!noBalance && <Balance_1.Balance address={address} detailed={detailed} fontSize={FONT_SIZES[size]}/>}
    </Shared_styles_1.Stacked>);
}
function AddressSummary(props) {
    var address = props.address, _a = props.justifyContent, justifyContent = _a === void 0 ? 'space-around' : _a, _b = props.orientation, orientation = _b === void 0 ? 'vertical' : _b, _c = props.size, size = _c === void 0 ? 'medium' : _c;
    return address ?
        orientation === 'vertical'
            ? (<Shared_styles_1.Stacked justifyContent={justifyContent}>
              {renderIcon(address, size)}
              {renderDetails(address, props)}
            </Shared_styles_1.Stacked>)
            : (<Shared_styles_1.StackedHorizontal justifyContent={justifyContent}>
              {renderIcon(address, size)}
              <Margin_1.Margin left/>
              <Shared_styles_1.Stacked>
                {renderDetails(address, props)}
              </Shared_styles_1.Stacked>
            </Shared_styles_1.StackedHorizontal>)
        : <div>No Address Provided</div>;
}
exports.AddressSummary = AddressSummary;
