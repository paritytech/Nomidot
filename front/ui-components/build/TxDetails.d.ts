import BN from 'bn.js';
import React from 'react';
import { AccordionProps } from './';
interface TxDetailsProps extends AccordionProps {
    allFees: BN;
    allTotal: BN;
    amount: BN;
    recipientAddress?: string;
    senderAddress: string;
    tokenSymbol?: string;
}
export declare function TxDetails({ allFees, allTotal, amount, recipientAddress, senderAddress, tokenSymbol, ...rest }: TxDetailsProps): React.ReactElement;
export {};
