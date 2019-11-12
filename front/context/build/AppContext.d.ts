import ApiRx from '@polkadot/api/rx';
import { ChainProperties, Health } from '@polkadot/types/interfaces';
import keyring from '@polkadot/ui-keyring';
import React from 'react';
export interface System {
    chain: string;
    health: Health;
    name: string;
    properties: ChainProperties;
    version: string;
}
export interface AppContextType {
    api: ApiRx;
    isReady: boolean;
    keyring: typeof keyring;
    system: System;
}
export declare const AppContext: React.Context<AppContextType>;
