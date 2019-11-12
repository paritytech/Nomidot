import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { DerivedBalances, DerivedFees, DerivedStaking } from '@polkadot/api-derive/types';
import { Balance, Index } from '@polkadot/types/interfaces';
import BN from 'bn.js';
export declare type AccountDerivedStakingMap = Record<string, DerivedStaking>;
/**
 * Form fields inputted by the user
 */
export interface UserInputs {
    amountAsString: string;
    currentAccount: string;
    recipientAddress: string;
}
/**
 * Results from api subscription (nonce, balance, fees)
 */
export interface SubResults {
    accountNonce: Index;
    currentBalance: DerivedBalances;
    fees: DerivedFees;
    recipientBalance?: DerivedBalances;
}
export interface WithExtrinsic {
    extrinsic: SubmittableExtrinsic<'rxjs'>;
}
/**
 * Amount as Balance
 */
export interface WithAmount {
    amount: Balance;
}
/**
 * Derived fees and flags from subscription results and user inputs
 */
export interface WithDerived {
    allFees: BN;
    allTotal: BN;
    hasAvailable: boolean;
    isCreation: boolean;
    isNoEffect: boolean;
    isRemovable: boolean;
    isReserved: boolean;
    overLimit: boolean;
}
/**
 * Everything above
 */
export declare type AllExtrinsicData = SubResults & UserInputs & WithExtrinsic & WithAmount & WithDerived;
/**
 * Form errors and warnings
 */
export declare type Errors = Partial<Record<keyof (SubResults & UserInputs & WithExtrinsic & WithAmount), string>>;
export declare type Warnings = string[];
