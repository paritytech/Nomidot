"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
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
exports.AlertsContext = react_1.createContext({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    enqueue: function (newAlertWithoutId) { console.error('No context provider found above in the tree.'); },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    remove: function (Alertid) { console.error('No context provider found above in the tree.'); },
    alerts: []
});
function AlertsContextProvider(props) {
    var _a = __read(react_1.useState({ alerts: [], nextAlertId: 0 }), 2), _b = _a[0], alerts = _b.alerts, nextAlertId = _b.nextAlertId, setAlerts = _a[1];
    var remove = function (alertId) {
        setAlerts({
            alerts: __spread(alerts.filter(function (_a) {
                var id = _a.id;
                return id !== alertId;
            })),
            nextAlertId: nextAlertId
        });
    };
    var enqueue = function (newAlertWithoutId) {
        setAlerts({
            alerts: __spread(alerts, [
                __assign(__assign({}, newAlertWithoutId), { id: nextAlertId, timerCb: setTimeout(function () { remove(nextAlertId); }, 3000) })
            ]),
            nextAlertId: nextAlertId + 1
        });
    };
    return <exports.AlertsContext.Provider value={{ enqueue: enqueue, remove: remove, alerts: alerts }}>
    {props.children}
  </exports.AlertsContext.Provider>;
}
exports.AlertsContextProvider = AlertsContextProvider;
