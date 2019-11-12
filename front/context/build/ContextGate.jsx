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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("@polkadot/api");
var types_1 = require("@polkadot/types");
var ui_keyring_1 = __importDefault(require("@polkadot/ui-keyring"));
var util_1 = require("@polkadot/util");
var react_1 = __importStar(require("react"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var AlertsContext_1 = require("./AlertsContext");
var AppContext_1 = require("./AppContext");
var StakingContext_1 = require("./StakingContext");
var TxQueueContext_1 = require("./TxQueueContext");
var util_2 = require("./util");
var INIT_ERROR = new Error('Please wait for `isReady` before fetching this property');
var DISCONNECTED_STATE_PROPERTIES = {
    isReady: false,
    system: {
        get chain() {
            throw INIT_ERROR;
        },
        get health() {
            throw INIT_ERROR;
        },
        get name() {
            throw INIT_ERROR;
        },
        get properties() {
            throw INIT_ERROR;
        },
        get version() {
            throw INIT_ERROR;
        }
    }
};
// Hardcode default to Kusama
var WS_URL = 'wss://kusama-rpc.polkadot.io/'; // FIXME Change to localhost when light client ready
// Most chains (including Kusama) put the ss58 prefix in the chain properties.
// Just in case, we default to 42
var SS58_PREFIX = 42;
var keyringInitialized = false;
var l = util_1.logger('context');
var api = new api_1.ApiRx({ provider: new api_1.WsProvider(WS_URL) });
function ContextGate(props) {
    var children = props.children;
    var _a = __read(react_1.useState(DISCONNECTED_STATE_PROPERTIES), 2), state = _a[0], setState = _a[1];
    var isReady = state.isReady, system = state.system;
    react_1.useEffect(function () {
        // Block the UI when disconnected
        api.isConnected.pipe(operators_1.filter(function (isConnected) { return !isConnected; })).subscribe(function () {
            setState(DISCONNECTED_STATE_PROPERTIES);
        });
        // We want to fetch all the information again each time we reconnect. We
        // might be connecting to a different node, or the node might have changed
        // settings.
        api.isConnected
            .pipe(operators_1.filter(function (isConnected) { return !!isConnected; }), 
        // API needs to be ready to be able to use RPCs; connected isn't enough
        operators_1.switchMap(function () {
            return api.isReady;
        }), operators_1.switchMap(function () {
            return rxjs_1.combineLatest([
                api.rpc.system.chain(),
                api.rpc.system.health(),
                api.rpc.system.name(),
                api.rpc.system.properties(),
                api.rpc.system.version()
            ]);
        }))
            .subscribe(function (_a) {
            var _b = __read(_a, 5), chain = _b[0], health = _b[1], name = _b[2], properties = _b[3], version = _b[4];
            if (!keyringInitialized) {
                // keyring with Schnorrkel support
                ui_keyring_1.default.loadAll({
                    ss58Format: properties.ss58Format.unwrapOr(types_1.createType('u8', SS58_PREFIX)).toNumber(),
                    genesisHash: api.genesisHash,
                    isDevelopment: util_2.isTestChain(chain.toString()),
                    type: 'ed25519'
                });
                keyringInitialized = true;
            }
            else {
                // The keyring can only be initialized once. To make sure that the
                // keyring values are up-to-date in case the node has changed settings
                // we need to reinitialize it.
                window.location.reload();
                return;
            }
            l.log("Api connected to " + WS_URL);
            l.log("Api ready, connected to chain \"" + chain + "\" with properties " + JSON.stringify(properties));
            setState({
                isReady: true,
                system: {
                    chain: chain.toString(),
                    health: health,
                    name: name.toString(),
                    properties: properties,
                    version: version.toString()
                }
            });
        });
    }, []);
    return (<AlertsContext_1.AlertsContextProvider>
      <TxQueueContext_1.TxQueueContextProvider>
        <AppContext_1.AppContext.Provider value={{
        api: api,
        isReady: isReady,
        keyring: ui_keyring_1.default,
        system: system
    }}>
          <StakingContext_1.StakingContextProvider>
            {children}
          </StakingContext_1.StakingContextProvider>
        </AppContext_1.AppContext.Provider>
      </TxQueueContext_1.TxQueueContextProvider>
    </AlertsContext_1.AlertsContextProvider>);
}
exports.ContextGate = ContextGate;
