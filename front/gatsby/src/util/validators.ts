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

import { Nomination, OfflineValidator, Validator, TableRowData } from '../types';

// TODO also join with prefernces
interface JoinNominationsAndOffline {
  validatorController: string;
  validatorStash: string;
  nominatorController: string;
  nominatorStash: string;
  stakedAmount: string; // hex....
  wasOfflineThisSession: boolean;
}

export function joinDataIntoTableRow(
  api: ApiRx,
  currentNominations: Nomination[],
  currentOffline: OfflineValidator[],
  currentValidators: Validator[]
): TableRowData {
  const currentOfflineDecoded: OfflineValidator[] = [];
  const dedup: Set<JoinNominationsAndOffline> = new Set();
  let result: JoinNominationsAndOffline[] = [];
  const final: TableRowData = {};
  /*
   * FFS validators is publickeys, offline is SS58 Address so gotta fix that...
   * since |current offline| is on average smaller than all the nominations, cheaper
   * to decode ss58 to public key and match than other way around.
   *
   * FIXME: V1.5 sync fix, either sync with Polkascan Harvester or make sure to edit the task.
   */
  currentOffline &&
    currentOffline.length &&
    currentOffline.map((offline: OfflineValidator) => {
      const pubkey = u8aToHex(decodeAddress(offline.validatorId));

      currentOfflineDecoded.push({
        ...offline,
        validatorId: pubkey,
      });
    });

  /*
   * FIXME: do this on server side
   * in theory not great, but unnoticeable in practice
   * O(N*M) where N = |nominations|, M = |offline|
   */
  currentNominations.map((nomination: Nomination) => {
    if (currentOfflineDecoded.length) {
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
      dedup.add({
        ...nomination,
        wasOfflineThisSession: false,
      });
    }
  });
  result = Array.from(dedup);

  result.map((value: JoinNominationsAndOffline) => {
    // entry doesnt exist yet
    if (!final[value.validatorStash]) {
      const preferences = currentValidators.find((validator: Validator) => validator.stash === value.validatorStash)?.preferences;
      
      final[value.validatorStash] = {
        validatorController: value.validatorController,
        validatorStash: value.validatorStash,
        nominators: [value.nominatorStash],
        stakedAmount: createType(
          api.registry,
          'Balance',
          value.stakedAmount
        ).toBn(), // need to cast it to the polkadotjs type first...
        preferences,
        wasOfflineThisSession: value.wasOfflineThisSession,
      };
    } else {
      // entry exists
      const stakedAmount = (final[value.validatorStash].stakedAmount as BN).add(
        createType(api.registry, 'Balance', value.stakedAmount).toBn()
      ); // need to cast it to the polkadotjs type first...
      
      final[value.validatorStash] = {
        ...final[value.validatorStash],
        stakedAmount,
      };

      final[value.validatorStash].nominators.push(value.nominatorStash);
    }
  });

  console.log('final => ', final);

  return final;
}
