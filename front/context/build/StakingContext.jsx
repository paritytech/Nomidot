"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
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
var react_1 = __importStar(require("react"));
var operators_1 = require("rxjs/operators");
var AppContext_1 = require("./AppContext");
exports.StakingContext = react_1.createContext({
    accountStakingMap: {},
    allControllers: [],
    allStashes: [],
    allStashesAndControllers: [[], []],
    derivedBalanceFees: {},
    onlyBondedAccounts: {}
});
function StakingContextProvider(props) {
    var children = props.children;
    var _a = react_1.useContext(AppContext_1.AppContext), api = _a.api, isReady = _a.isReady, keyring = _a.keyring;
    var _b = __read(react_1.useState({}), 2), accountStakingMap = _b[0], setAccountStakingMap = _b[1];
    var _c = __read(react_1.useState({}), 2), onlyBondedAccounts = _c[0], setOnlyBondedAccounts = _c[1];
    var _d = __read(react_1.useState(), 2), allStashesAndControllers = _d[0], setAllStashesAndControllers = _d[1];
    var _e = __read(react_1.useState([]), 2), allStashes = _e[0], setAllStashes = _e[1];
    var _f = __read(react_1.useState([]), 2), allControllers = _f[0], setAllControllers = _f[1];
    var _g = __read(react_1.useState({}), 2), derivedBalanceFees = _g[0], setDerivedBalanceFees = _g[1];
    // get derive.staking.info for each account in keyring
    react_1.useEffect(function () {
        if (!isReady) {
            return;
        }
        var accounts = keyring.getAccounts();
        accounts.map(function (_a) {
            var address = _a.address;
            var subscription = api.derive.staking.info(address)
                .pipe(operators_1.take(1))
                .subscribe(function (derivedStaking) {
                var newAccountStakingMap = accountStakingMap;
                newAccountStakingMap[address] = derivedStaking;
                setAccountStakingMap(newAccountStakingMap);
                if (derivedStaking.stashId && derivedStaking.controllerId) {
                    setOnlyBondedAccounts(newAccountStakingMap);
                }
            });
            return function () { return subscription.unsubscribe(); };
        });
    }, [accountStakingMap, api, isReady, keyring]);
    // get allStashesAndControllers
    react_1.useEffect(function () {
        if (!isReady) {
            return;
        }
        var controllersSub = api.derive.staking.controllers()
            .pipe(operators_1.take(1))
            .subscribe(function (allStashesAndControllers) {
            setAllStashesAndControllers(allStashesAndControllers);
            var allControllers = allStashesAndControllers[1].filter(function (optional) { return optional.isSome; })
                .map(function (accountId) { return accountId.unwrap(); });
            var allStashes = allStashesAndControllers[0];
            setAllControllers(allControllers);
            setAllStashes(allStashes);
        });
        return function () { return controllersSub.unsubscribe(); };
    }, [api, isReady]);
    // derived fees
    react_1.useEffect(function () {
        if (!isReady) {
            return;
        }
        var feeSub = api.derive.balances.fees()
            .pipe(operators_1.take(1))
            .subscribe(setDerivedBalanceFees);
        return function () { return feeSub.unsubscribe(); };
    }, [api, isReady]);
    return (<exports.StakingContext.Provider value={{
        accountStakingMap: accountStakingMap,
        allControllers: allControllers,
        allStashes: allStashes,
        allStashesAndControllers: allStashesAndControllers,
        derivedBalanceFees: derivedBalanceFees,
        onlyBondedAccounts: onlyBondedAccounts
    }}>
      {children}
    </exports.StakingContext.Provider>);
}
exports.StakingContextProvider = StakingContextProvider;
