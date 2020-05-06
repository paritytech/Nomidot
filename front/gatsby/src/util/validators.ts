// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/*
* This entire thing would not be needed after v1.5 sync happens.
*/

import { ApiRx } from '@polkadot/api';
import { createType } from '@polkadot/types';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
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
// , currentValidators: Validator[]
export function joinDataIntoTableRow(api: ApiRx, currentNominations: Nomination[], currentOffline: OfflineValidator[]): TableRowData {
  let currentOfflineDecoded: OfflineValidator[] = [];
  let dedup: Set<JoinNominationsAndOffline> = new Set();
  let result: JoinNominationsAndOffline[] = [];
  let final: TableRowData = {};
  console.log('in here => ', currentNominations);
  console.log('also here => ', currentOffline);

  /*
  * FFS validators is publickeys, offline is SS58 Address so gotta fix that...
  * since |current offline| is on average smaller than all the nominations, cheaper
  * to decode ss58 to public key and match than other way around.
  * 
  * FIXME: V1.5 sync fix, either sync with Polkascan Harvester or make sure to edit the task.
  */
 currentOffline && currentOffline.length && currentOffline.map((offline: OfflineValidator) => {
    let pubkey = u8aToHex(decodeAddress(offline.validatorId));

    console.log('pub key -=> ', pubkey);
    currentOfflineDecoded.push({
      ...offline,
      validatorId: pubkey
    });
  })

  /*
  * FIXME: do this on server side
  * in theory not great, but unnoticeable in practice
  * O(N*M) where N = |validators|, M = |offline|
  */
  currentNominations.map((nomination: Nomination) => {
    console.log('nominations +');
    if (currentOfflineDecoded.length) {
      console.log('current offline decoded + ');
      currentOfflineDecoded.map((offline: OfflineValidator) => {
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
      });
    } else {
      console.log('current offline decoded - ');
      dedup.add({
        ...nomination,
        wasOfflineThisSession: false
      })
    }
  });
  result = Array.from(dedup);

  result.map((value: JoinNominationsAndOffline) => {
    // entry doesnt exist yet
    if (!final[value.validatorStash]) {
      let nominatorsSet: Set<string> = new Set();
      nominatorsSet.add(value.nominatorStash);
      console.log(' new Set(value.nominatorStash) ',  nominatorsSet);
      final[value.validatorStash] = {
        validatorController: value.validatorController,
        validatorStash: value.validatorStash,
        nominators: nominatorsSet,
        stakedAmount: createType(api.registry, 'Balance', value.stakedAmount).toBn(), // need to cast it to the polkadotjs type first...
        wasOfflineThisSession: value.wasOfflineThisSession
      }

      console.log('created => ', final[value.validatorStash]);
    } else { // entry exists
      console.log('existing =>', final[value.validatorStash].nominators);
      let nominators = final[value.validatorStash].nominators.add(value.nominatorStash);
      let stakedAmount = final[value.validatorStash].stakedAmount.add(createType(api.registry, 'Balance', value.stakedAmount).toBn()); // need to cast it to the polkadotjs type first...

      console.log('entry exits => ', final);

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