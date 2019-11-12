import { Option } from '@polkadot/types';
import { AccountId } from '@polkadot/types/interfaces';
import { DerivedFees, DerivedStaking } from '@polkadot/api-derive/types';
import React from 'react';
export declare const StakingContext: React.Context<{
    accountStakingMap: Record<string, DerivedStaking>;
    allControllers: AccountId[];
    allStashes: AccountId[];
    allStashesAndControllers: [AccountId[], Option<AccountId>[]];
    derivedBalanceFees: DerivedFees;
    onlyBondedAccounts: Record<string, DerivedStaking>;
}>;
interface Props {
    children: React.ReactNode;
}
export declare function StakingContextProvider(props: Props): React.ReactElement;
export {};
