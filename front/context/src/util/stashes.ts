// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { DeriveStakingQuery } from '@polkadot/api-derive/types';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { Option } from '@polkadot/types';
import { AccountId, StakingLedger } from '@polkadot/types/interfaces';

function getControllers(
  accounts: InjectedAccountWithMeta[],
  stashControllerMap: Record<string, DeriveStakingQuery>
): InjectedAccountWithMeta[] {
  const allStakingInfo = Object.values(stashControllerMap);
  const allControllers: InjectedAccountWithMeta[] = [];

  accounts.forEach(account => {
    allStakingInfo.forEach(staking => {
      if (
        staking.controllerId &&
        staking.controllerId.toHuman &&
        staking.controllerId.toHuman() === account.address
      ) {
        allControllers.push(account);
      }
    });
  });

  return allControllers;
}

function getStashes(
  allAccounts: string[],
  ownBonded: Option<AccountId>[],
  ownLedger: Option<StakingLedger>[]
): string[] {
  const result: string[] = [];

  ownBonded.forEach((value, index): void => {
    value.isSome && result.push(allAccounts[index]);
  });

  ownLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !result.some(([accountId]): boolean => accountId === stashId) &&
        result.push(stashId);
    }
  });

  return result;
}

export { getControllers, getStashes };
