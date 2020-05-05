// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

import { OfflineValidator, Nomination, Validator } from '../types';

// TODO also join with prefernces
interface JoinNominationsAndOffline {
  validatorController: string;
  validatorStash: string;
  nominatorController: string;
  nominatorStash: string;
  stakedAmount: string; // hex....
  wasOfflineThisSession: boolean;
}

interface TableRowData {
  [validatorStash: string]: {
    validatorController: string,
    validatorStash: string,
    nominators: Set<string>, // by stash, deduped
    stakedAmount: BN, // sum up all the staked amounts
    // preferences: ValidatorPrefs,
    wasOfflineThisSession: boolean
  }
}

export function JoinDataIntoTableRow(currentNominations: Nomination[], currentOffline: OfflineValidator[], currentValidators: Validator[]): TableRowData {
  let dedup: Set<JoinNominationsAndOffline> = new Set();
  let result: JoinNominationsAndOffline[] = [];
  let final: TableRowData = {};

  /*
  * FIXME: do this on server side
  * in theory not great, but unnoticeable in practice
  * O(N*M) where N = |validators|, M = |offline|
  */
  currentNominations.map((nomination: Nomination) => {
    currentOffline.map((offline: OfflineValidator) => {
          if (
            nomination.validatorStash === offline.validatorId ||
            nomination.validatorController === offline.validatorId
          ) {
            dedup.add({
              ...nomination,
              wasOfflineThisSession: true,
            });
          } else {
            dedup.add({
              ...nomination,
              wasOfflineThisSession: false,
            });
          }
        }
      );
    });
    result = Array.from(dedup);


    result.map((value: JoinNominationsAndOffline) => {
      // entry doesnt exist yet
      if (!!final[value.validatorStash]) {
        final[value.validatorStash] = {
          validatorController: value.validatorController,
          validatorStash: value.validatorStash,
          nominators: new Set(value.nominatorStash),
          stakedAmount: new BN(value.stakedAmount), // need to cast it to the polkadotjs type first...
          wasOfflineThisSession: value.wasOfflineThisSession
        }
      } else { // entry exists
        let nominators = final[value.validatorStash].nominators.add(value.nominatorStash);
        let stakedAmount = final[value.validatorStash].stakedAmount.add(new BN(value.stakedAmount)); // need to cast it to the polkadotjs type first...
        final[value.validatorStash] = {
          ...final[value.validatorStash],
          nominators,
          stakedAmount,
          wasOfflineThisSession: value.wasOfflineThisSession
        }
      }
    })
  
  return final;
}