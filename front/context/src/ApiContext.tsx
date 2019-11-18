// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import ApiRx from '@polkadot/api/rx';
import { ChainProperties, Health } from '@polkadot/types/interfaces';
import React from 'react';

export interface System {
	chain: string;
	health: Health;
	name: string;
	properties: ChainProperties;
	version: string;
}

export interface ApiContextType {
	api: ApiRx; // From @polkadot/api
	isReady: boolean; // Are api and keyring loaded?
	system: System; // Information about the chain
}

export const ApiContext: React.Context<ApiContextType> = React.createContext(
	{} as ApiContextType
);
