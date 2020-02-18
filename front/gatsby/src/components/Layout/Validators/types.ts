
import { ValidatorPrefs } from '@polkadot/types/interfaces';

export interface Validator {
  controller: string,
  stash: string,
  preferences: ValidatorPrefs
}