"use strict";
// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A handler for HTML click/change/input events
 * @example
 * ```typescript
 * const handleChangeName = handler(setName);
 *
 * <Input onChange={handleChangeName} />;
 * ```
 */
function handler(setter) {
    return function (_a) {
        var value = _a.target.value;
        setter(value);
    };
}
exports.handler = handler;
