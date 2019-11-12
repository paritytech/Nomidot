"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@polkadot/util");
var react_1 = __importDefault(require("react"));
var Loader_1 = __importDefault(require("semantic-ui-react/dist/commonjs/elements/Loader"));
var Shared_styles_1 = require("./Shared.styles");
var index_1 = require("./index");
var defaultProps = {
    detailed: false,
    fontSize: 'large'
};
// FIXME: https://github.com/paritytech/substrate-light-ui/issues/471
function BalanceDisplay(props) {
    if (props === void 0) { props = defaultProps; }
    var allBalances = props.allBalances, allStaking = props.allStaking, detailed = props.detailed, fontSize = props.fontSize, fontWeight = props.fontWeight, handleRedeem = props.handleRedeem;
    var renderRedeemButton = function () {
        return (allStaking && allStaking.controllerId
            ? (<Shared_styles_1.StyledLinkButton onClick={function () { return allStaking && allStaking.controllerId && handleRedeem && handleRedeem(allStaking.controllerId.toString()); }}>
          <index_1.Icon name='lock'/>
          Redeem Funds
        </Shared_styles_1.StyledLinkButton>)
            : null);
    };
    var renderUnlocking = function () {
        return (allStaking && allStaking.unlocking
            ? (<>
            {allStaking.unlocking.map(function (_a, index) {
                var remainingBlocks = _a.remainingBlocks, value = _a.value;
                return (<div key={index}>
                <Shared_styles_1.FadedText>Unbonded Amount: {util_1.formatBalance(value)}</Shared_styles_1.FadedText>
                <Shared_styles_1.FadedText> Blocks remaining: {remainingBlocks.toNumber()}</Shared_styles_1.FadedText>
              </div>);
            })}
          </>)
            : null);
    };
    var renderDetailedBalances = function () {
        var _a = allBalances, availableBalance = _a.availableBalance, lockedBalance = _a.lockedBalance, reservedBalance = _a.reservedBalance;
        return (<react_1.default.Fragment>
        <span><b>Available:</b> <Shared_styles_1.FadedText>{util_1.formatBalance(availableBalance)}</Shared_styles_1.FadedText></span>
        <span>
          {allStaking && allStaking.redeemable &&
            <Shared_styles_1.Stacked>
              <b>Redeemable:</b>
              <Shared_styles_1.FadedText>{util_1.formatBalance(allStaking.redeemable)}</Shared_styles_1.FadedText>
              {allStaking.redeemable.gtn(0) && renderRedeemButton()}
            </Shared_styles_1.Stacked>}
        </span>
        <span><b>Reserved:</b>{reservedBalance && <Shared_styles_1.FadedText>{util_1.formatBalance(reservedBalance)}</Shared_styles_1.FadedText>}</span>
        <span><b>Locked:</b>{lockedBalance && <Shared_styles_1.FadedText>{util_1.formatBalance(lockedBalance)}</Shared_styles_1.FadedText>}</span>
        {renderUnlocking()}
      </react_1.default.Fragment>);
    };
    return (<Shared_styles_1.Stacked>
      {allBalances
        ? <react_1.default.Fragment>
          <Shared_styles_1.DynamicSizeText fontSize={fontSize} fontWeight={fontWeight}>
            <strong>Total Balance:</strong> {allBalances.freeBalance && util_1.formatBalance(allBalances.freeBalance)}
          </Shared_styles_1.DynamicSizeText>
          <Shared_styles_1.FadedText>Transactions: {util_1.formatNumber(allBalances.accountNonce)} </Shared_styles_1.FadedText>
        </react_1.default.Fragment>
        : <Loader_1.default active inline/>}
      {detailed &&
        allBalances &&
        renderDetailedBalances()}
    </Shared_styles_1.Stacked>);
}
exports.BalanceDisplay = BalanceDisplay;
