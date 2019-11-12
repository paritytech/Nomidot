import { DerivedBalances, DerivedStaking } from '@polkadot/api-derive/types';
import React from 'react';
import { FontSize, FontWeight } from './types';
export declare type BalanceDisplayProps = {
    allBalances?: DerivedBalances;
    allStaking?: DerivedStaking;
    detailed?: boolean;
    fontSize?: FontSize;
    fontWeight?: FontWeight;
    handleRedeem?: (address: string) => void;
};
export declare function BalanceDisplay(props?: BalanceDisplayProps): React.ReactElement;
