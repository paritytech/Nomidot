import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { Balance } from '@polkadot/types/interfaces';
import BN from 'bn.js';
import React from 'react';
import { Subject } from 'rxjs';
declare type Extrinsic = SubmittableExtrinsic<'rxjs'>;
export interface ExtrinsicDetails {
    allFees: BN;
    allTotal: BN;
    amount: Balance;
    methodCall: string;
    recipientAddress?: string;
    senderPair: KeyringPair;
}
/**
 * An item from the TxQueue
 */
export interface PendingExtrinsic {
    details: ExtrinsicDetails;
    extrinsic: Extrinsic;
    id: number;
    status: {
        isAskingForConfirm: boolean;
        isFinalized: boolean;
        isDropped: boolean;
        isPending: boolean;
        isUsurped: boolean;
    };
    unsubscribe: () => void;
}
export interface EnqueueParams extends ExtrinsicDetails {
    extrinsic: Extrinsic;
}
interface Props {
    children: React.ReactNode;
}
export declare const TxQueueContext: React.Context<{
    enqueue: (extrinsic: Extrinsic, details: ExtrinsicDetails) => void;
    txQueue: PendingExtrinsic[];
    submit: (extrinsicId: number) => void;
    clear: () => void;
    cancelObservable: Subject<{
        msg: string;
    }>;
    successObservable: Subject<ExtrinsicDetails>;
    errorObservable: Subject<{
        error: string;
    }>;
}>;
export declare function TxQueueContextProvider(props: Props): React.ReactElement;
export {};
