import { Keyring } from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { Either } from 'fp-ts/lib/Either';
/**
 * From an `account` string, check if it's in the keyring, and returns an
 * Either<Error,KeyringAddress>.
 */
export declare function getKeyringAccount(keyring: Keyring, account?: string): Either<Error, KeyringAddress>;
/**
 * From an `address` string, check if it's in the keyring, and returns an
 * Either<Error,KeyringAddress>.
 */
export declare function getKeyringAddress(keyring: Keyring, address?: string): Either<Error, KeyringAddress>;
