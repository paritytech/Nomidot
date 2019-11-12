import BN from 'bn.js';
import React from 'react';
declare type TxSummaryProps = {
    amount: BN;
    methodCall: string;
    recipientAddress?: string;
    senderAddress: string;
    tokenSymbol?: string;
};
export declare function TxSummary({ amount, methodCall, recipientAddress, senderAddress, tokenSymbol }: TxSummaryProps): React.ReactElement;
export {};
