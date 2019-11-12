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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var rxjs_1 = require("rxjs");
var util_1 = require("@polkadot/util");
var l = util_1.logger('tx-queue');
var INIT_ERROR = new Error('TxQueueContext called without Provider.');
var cancelObservable = new rxjs_1.Subject();
var successObservable = new rxjs_1.Subject();
var errorObservable = new rxjs_1.Subject();
exports.TxQueueContext = react_1.createContext({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    enqueue: function (extrinsic, details) { console.error(INIT_ERROR); },
    txQueue: [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    submit: function (extrinsicId) { console.error(INIT_ERROR); },
    clear: function () { console.error(INIT_ERROR); },
    cancelObservable: cancelObservable,
    successObservable: successObservable,
    errorObservable: errorObservable
});
function TxQueueContextProvider(props) {
    var _a = __read(react_1.useState(0), 2), txCounter = _a[0], setTxCounter = _a[1]; // Number of tx sent in total
    var _b = __read(react_1.useState([]), 2), txQueue = _b[0], setTxQueue = _b[1];
    /**
     * Replace tx with id `extrinsicId` with a new tx
     */
    var replaceTx = function (extrinsicId, newTx) {
        setTxQueue(function (prevTxQueue) { return prevTxQueue.map(function (tx) { return (tx.id === extrinsicId
            ? newTx
            : tx); }); });
    };
    /**
     * Unsubscribe the tx with id `extrinsicId`
     */
    var closeTxSubscription = function (extrinsicId) {
        var tx = txQueue.find(function (tx) { return tx.id === extrinsicId; });
        if (tx) {
            tx.unsubscribe();
            setTxQueue(txQueue.splice(txQueue.indexOf(tx), 1));
        }
    };
    /**
     * Add a tx to the queue
     */
    var enqueue = function (extrinsic, details) {
        var extrinsicId = txCounter;
        setTxCounter(txCounter + 1);
        l.log("Queued extrinsic #" + extrinsicId + " from " + details.senderPair.address + " to " + details.recipientAddress + " of amount " + details.amount, details);
        setTxQueue(txQueue.concat({
            details: details,
            extrinsic: extrinsic,
            id: extrinsicId,
            status: {
                isAskingForConfirm: true,
                isFinalized: false,
                isDropped: false,
                isPending: false,
                isUsurped: false
            },
            unsubscribe: function () { }
        }));
    };
    /**
     * Sign and send the tx with id `extrinsicId`
     */
    var submit = function (extrinsicId) {
        var pendingExtrinsic = txQueue.find(function (tx) { return tx.id === extrinsicId; });
        if (!pendingExtrinsic) {
            l.error("There's no extrinsic with id #" + extrinsicId);
            return;
        }
        var details = pendingExtrinsic.details, extrinsic = pendingExtrinsic.extrinsic, status = pendingExtrinsic.status;
        var senderPair = details.senderPair;
        if (!status.isAskingForConfirm) {
            l.error("Extrinsic #" + extrinsicId + " is being submitted, but its status is not isAskingForConfirm");
            return;
        }
        l.log("Extrinsic #" + extrinsicId + " is being sent");
        var subscription = extrinsic
            .signAndSend(senderPair) // send the extrinsic
            .subscribe(function (txResult) {
            var _a = txResult.status, isFinalized = _a.isFinalized, isDropped = _a.isDropped, isUsurped = _a.isUsurped;
            l.log("Extrinsic #" + extrinsicId + " has new status:", txResult);
            replaceTx(extrinsicId, __assign(__assign({}, pendingExtrinsic), { status: {
                    isAskingForConfirm: false,
                    isDropped: isDropped,
                    isFinalized: isFinalized,
                    isPending: false,
                    isUsurped: isUsurped
                } }));
            if (isFinalized) {
                successObservable.next(details);
            }
            if (isFinalized || isDropped || isUsurped) {
                closeTxSubscription(extrinsicId);
            }
        }, function (error) {
            errorObservable.next({ error: error.message });
        }, function () {
            // Lock pair, as we don't need it anymore
            // In the future, the locking strategy could be done in ui-keyring:
            // https://github.com/polkadot-js/apps/issues/1102
            senderPair.lock();
        });
        replaceTx(extrinsicId, __assign(__assign({}, pendingExtrinsic), { status: __assign(__assign({}, pendingExtrinsic.status), { isAskingForConfirm: false, isPending: true }), unsubscribe: function () { subscription.unsubscribe(); } }));
    };
    /**
     * Clear the txQueue.
     */
    var clear = function () {
        var msg = [];
        txQueue.forEach(function (_a) {
            var method = _a.extrinsic.method, unsubscribe = _a.unsubscribe;
            msg.push(method.sectionName + "." + method.methodName);
            unsubscribe();
        });
        setTxQueue([]);
        l.log('Cleared all extrinsics');
        cancelObservable.next({ msg: "cleared the following extrinsic(s): " + msg.join(' ') });
    };
    return (<exports.TxQueueContext.Provider value={{
        clear: clear,
        enqueue: enqueue,
        submit: submit,
        txQueue: txQueue,
        successObservable: successObservable,
        errorObservable: errorObservable,
        cancelObservable: cancelObservable
    }}>
      {props.children}
    </exports.TxQueueContext.Provider>);
}
exports.TxQueueContextProvider = TxQueueContextProvider;
