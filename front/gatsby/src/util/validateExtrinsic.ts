// // Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// // This software may be modified and distributed under the terms
// // of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesAll, DerivedFees } from '@polkadot/api-derive/types';
import { SubmittableExtrinsic } from '@polkadot/api/submittable/types';
import { AccountInfo, Balance } from '@polkadot/types/interfaces';
import { compactToU8a } from '@polkadot/util';
import BN from 'bn.js';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const LENGTH_PUBLICKEY = 32 + 1; // publicKey + prefix
const LENGTH_SIGNATURE = 64;
const LENGTH_ERA = 1;
const SIGNATURE_SIZE = LENGTH_PUBLICKEY + LENGTH_SIGNATURE + LENGTH_ERA;

type Error = string;
type Errors = Error[];

// type Warnings = string[];

// /**
//  * Make sure the amount (as a BN) is correct.
//  */
// function validateTransferAmount(
//   amountAsString: string
// ): Error | undefined {
//   const amount = new BN(amountAsString) as Balance;
//   let errors: Errors = [];

//   if (amount.isNeg()) {
//     return 'Please enter a positive amount to transfer.';
//   }

//   if (amount.isZero()) {
//     return 'Please make sure you are sending more than 0 balance.';
//   }
// }

/**
 * Make sure derived validations (fees, minimal amount) are correct.
 * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L63-L111
 */
export function validateFees(
  accountNonce: AccountInfo,
  amount = new BN(0),
  currentBalance: DerivedBalancesAll,
  extrinsic: SubmittableExtrinsic<'promise' | 'rxjs'>,
  fees: DerivedFees,
  recipientBalance?: DerivedBalancesAll
): Errors {
  const txLength =
    SIGNATURE_SIZE +
    compactToU8a(accountNonce.nonce).length +
    extrinsic.encodedLength;
  const allFees = fees.transactionBaseFee.add(
    fees.transactionByteFee.muln(txLength)
  );

  let isCreation = false;
  let isNoEffect = false;

  if (recipientBalance !== undefined) {
    isCreation =
      recipientBalance.votingBalance.isZero() && fees.creationFee.gtn(0);
    isNoEffect = amount
      .add(recipientBalance.votingBalance)
      .lte(fees.existentialDeposit);
  }

  const allTotal = amount
    .add(allFees)
    .add(isCreation ? fees.creationFee : new BN(0));

  const hasAvailable = currentBalance.freeBalance.gte(allTotal);
  const isRemovable = currentBalance.votingBalance
    .sub(allTotal)
    .lte(fees.existentialDeposit);
  const isReserved =
    currentBalance.freeBalance.isZero() &&
    currentBalance.reservedBalance.gtn(0);
  const overLimit = txLength >= MAX_SIZE_BYTES;

  const errors = {} as Errors;

  if (!hasAvailable) {
    errors.push('The selected account does not have the required balance available for this transaction.');
  }
  if (overLimit) {
    errors.push(`This transaction will be rejected by the node as it is greater than the maximum size of ${MAX_SIZE_MB}MB.`);
  }

  return errors;
}

// /**
//  * Make sure everything the user inputted is correct.
//  */
// function validateUserInputs(
//   amountAsString,
//   currentAccount,
//   recipientAddress,
//   extrinsic,
// ): Errors {
//   const errors = [] as Errors;

//   if (!currentAccount) {
//     errors.push('Please enter a sender account.');
//   }

//   if (
//     !recipientAddress &&
//     extrinsic &&
//     extrinsic.method.methodName === 'transfer'
//   ) {
//     errors.push('Please enter a recipient address.');
//   }

//   if (currentAccount === recipientAddress) {
//     errors.push('You cannot send balance to yourself.');
//   }

//   if (!amountAsString) {
//     errors.push('Please enter an amount');
//   }
  
//   return errors;
// }

// /**
//  * Show some warnings, that are not blocking the transaction, but may have
//  * undesirable effects for the user.
//  * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L158-L168
//  */
// export function validateWarnings(
//   fees,
//   hasAvailable,
//   isCreation,
//   isNoEffect,
//   isRemovable,
//   isReserved,
// ): Warnings {

//   const warnings = [];

//   if (isRemovable && hasAvailable) {
//     warnings.push(
//       'Submitting this transaction will drop the account balance to below the existential amount, which can result in the account being removed from the chain state and associated funds burned.'
//     );
//   }

//   if (isNoEffect) {
//     warnings.push(
//       'The final recipient balance is less than the existential amount and will not be reflected.'
//     );
//   }

//   if (isCreation) {
//     warnings.push(
//       `A fee of ${fees.creationFee} will be deducted from the sender since the destination account does not exist.`
//     );
//   }

//   if (isReserved) {
//     warnings.push(
//       'This account does have a reserved/locked balance, not taken into account'
//     );
//   }

//   return warnings.length > 0 ? some(warnings) : none;
// }