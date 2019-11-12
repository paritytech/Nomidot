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
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("@substrate/context/src");
var react_1 = __importStar(require("react"));
var rxjs_1 = require("rxjs");
var BalanceDisplay_1 = require("../BalanceDisplay");
function Balance(props) {
    var address = props.address, _a = props.detailed, detailed = _a === void 0 ? false : _a, rest = __rest(props, ["address", "detailed"]);
    var api = react_1.useContext(src_1.AppContext).api;
    var _b = __read(react_1.useState(), 2), allBalances = _b[0], setAllBalances = _b[1];
    var _c = __read(react_1.useState(), 2), allStaking = _c[0], setAllStaking = _c[1];
    react_1.useEffect(function () {
        var balanceSub = rxjs_1.combineLatest([
            api.derive.balances.all(address),
            api.derive.staking.info(address)
        ]).subscribe(function (_a) {
            var _b = __read(_a, 2), allBalances = _b[0], allStaking = _b[1];
            setAllBalances(allBalances);
            setAllStaking(allStaking);
        });
        return function () { return balanceSub.unsubscribe(); };
    }, [api, address]);
    var handleRedeem = function (address) {
        // FIXME We're not unsubscring here, we should
        rxjs_1.of(api.tx.staking.withdrawUnbonded(address)).subscribe();
    };
    return (<BalanceDisplay_1.BalanceDisplay allBalances={allBalances} allStaking={allStaking} detailed={detailed} handleRedeem={handleRedeem} {...rest}/>);
}
exports.Balance = Balance;
