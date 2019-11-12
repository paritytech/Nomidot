import React from 'react';
import { BalanceDisplayProps } from '../BalanceDisplay';
interface BalanceProps extends Pick<BalanceDisplayProps, Exclude<keyof BalanceDisplayProps, 'balance'>> {
    address: string;
    detailed?: boolean;
}
export declare function Balance(props: BalanceProps): React.ReactElement;
export {};
