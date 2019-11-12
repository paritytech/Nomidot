import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/lib/Option';
import { AllExtrinsicData, Errors, SubResults, UserInputs, WithAmount, WithExtrinsic } from '../types';
/**
 * Make sure derived validations (fees, minimal amount) are correct.
 * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L63-L111
 */
export declare function validateDerived(values: SubResults & UserInputs & WithExtrinsic & WithAmount): Either<Errors, AllExtrinsicData>;
/**
 * Show some warnings, that are not blocking the transaction, but may have
 * undesirable effects for the user.
 * @see https://github.com/polkadot-js/apps/blob/master/packages/ui-signer/src/Checks/index.tsx#L158-L168
 */
export declare function validateWarnings(values: AllExtrinsicData): Option<string[]>;
/**
 * Validate everything. The order of validation should be easily readable
 * from the `.chain()` syntax.
 */
export declare function validate(values: Partial<UserInputs & WithExtrinsic & SubResults>): Either<Errors, AllExtrinsicData>;
