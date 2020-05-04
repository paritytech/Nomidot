// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  DeriveBalancesAll,
  DeriveStakingAccount,
} from '@polkadot/api-derive/types';
import ApiRx from '@polkadot/api/rx';
import React, { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { BalanceDisplay, BalanceDisplayProps } from './BalanceDisplay';

interface BalanceProps
  extends Pick<
    BalanceDisplayProps,
    Exclude<keyof BalanceDisplayProps, 'balance'>
  > {
  address: string;
  api: ApiRx;
  detailed?: boolean;
}

export function Balance(props: BalanceProps): React.ReactElement {
  const { address, api, detailed = false, ...rest } = props;
  const [allBalances, setAllBalances] = useState<DeriveBalancesAll>();
  const [allStaking, setAllStaking] = useState<DeriveStakingAccount>();

  useEffect(() => {
    const balanceSub = api.isReady
      .pipe(
        switchMap(api =>
          combineLatest([
            api.derive.balances.all(address),
            api.derive.staking.account(address),
          ])
        )
      )
      .subscribe(([allBalances, allStaking]) => {
        setAllBalances(allBalances);
        setAllStaking(allStaking);
      });

    return (): void => balanceSub.unsubscribe();
  }, [address, api.isReady]);

  return (
    <BalanceDisplay
      allBalances={allBalances}
      allStaking={allStaking}
      detailed={detailed}
      {...rest}
    />
  );
}
