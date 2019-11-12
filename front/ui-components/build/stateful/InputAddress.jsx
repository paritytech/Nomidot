"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var react_identicon_1 = __importDefault(require("@polkadot/react-identicon"));
var accounts_1 = __importDefault(require("@polkadot/ui-keyring/observable/accounts"));
var addresses_1 = __importDefault(require("@polkadot/ui-keyring/observable/addresses"));
var react_1 = __importStar(require("react"));
var rxjs_1 = require("rxjs");
var Dropdown_1 = __importDefault(require("semantic-ui-react/dist/commonjs/modules/Dropdown"));
var styled_components_1 = __importDefault(require("styled-components"));
var constants_1 = require("../constants");
var Margin_1 = require("../Margin");
var DropdownItemText = styled_components_1.default.span(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  margin-left: ", ";\n"], ["\n  margin-left: ", ";\n"])), constants_1.MARGIN_SIZES.small);
/**
 * From the keyring, retrieve the `SingleAddress` from an `address` string
 */
function getAddressFromString(allAccounts, allAddresses, address) {
    return allAccounts[address] || allAddresses[address];
}
function renderDropdownItemText(address) {
    return (<DropdownItemText>
      <strong>{address.json.meta.name}</strong>
      <Margin_1.Margin as='span' right='small'/>
      ({address.json.address.substr(0, 3)}..{address.json.address.slice(-3)})
    </DropdownItemText>);
}
function InputAddress(props) {
    var onChangeAddress = props.onChangeAddress, _a = props.types, types = _a === void 0 ? ['accounts'] : _a, value = props.value, rest = __rest(props, ["onChangeAddress", "types", "value"]);
    var _b = __read(react_1.useState({}), 2), accounts = _b[0], setAccounts = _b[1];
    var _c = __read(react_1.useState({}), 2), addresses = _c[0], setAddresses = _c[1];
    var currentAddress = getAddressFromString(accounts, addresses, value);
    react_1.useEffect(function () {
        var subscription = rxjs_1.combineLatest([
            accounts_1.default.subject,
            addresses_1.default.subject
        ]).subscribe(function (_a) {
            var _b = __read(_a, 2), acc = _b[0], add = _b[1];
            setAccounts(acc);
            setAddresses(add);
        });
        return function () { return subscription.unsubscribe(); };
    }, []);
    function handleChange(_event, data) {
        if (data.value && onChangeAddress) {
            onChangeAddress(data.value.toString());
        }
    }
    function renderDropdownItem(address) {
        return <Dropdown_1.default.Item image={<react_identicon_1.default value={address.json.address} size={20}/>} key={address.json.address} onClick={handleChange} value={address.json.address} text={renderDropdownItemText(address)}/>;
    }
    return (<>
      <react_identicon_1.default value={value} size={20}/>
      <Margin_1.Margin right='small'/>
      <Dropdown_1.default labeled text={currentAddress ? currentAddress.json.meta.name : 'Loading...'} value={value} {...rest}>
        <Dropdown_1.default.Menu>
          {types.includes('accounts') && Object.keys(accounts).length > 0 && <Dropdown_1.default.Header>My accounts</Dropdown_1.default.Header>}
          {types.includes('accounts') && Object.values(accounts).map(renderDropdownItem)}
          {types.includes('addresses') && Object.keys(addresses).length > 0 && <Dropdown_1.default.Header>My addresses</Dropdown_1.default.Header>}
          {types.includes('addresses') && Object.values(addresses).map(renderDropdownItem)}
        </Dropdown_1.default.Menu>
      </Dropdown_1.default>
    </>);
}
exports.InputAddress = InputAddress;
var templateObject_1;
