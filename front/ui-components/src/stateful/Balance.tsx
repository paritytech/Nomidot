// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import { DerivedBalances, DerivedStakingAccount } from '@polkadot/api-derive/types';
import { ApiContext } from '@substrate/context';
import React, { useContext, useEffect, useState } from 'react';
import { combineLatest, of } from 'rxjs';

import { BalanceDisplay, BalanceDisplayProps } from '../BalanceDisplay';

interface BalanceProps
  extends Pick<
    BalanceDisplayProps,
    Exclude<keyof BalanceDisplayProps, 'balance'>
  > {
  address: string;
  detailed?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export function Balance(props: BalanceProps): React.ReactElement {
  const {
    address,
    detailed = false,
    orientation = 'horizontal',
    ...rest
  } = props;
  const { api, isReady } = useContext(ApiContext);
  const [allBalances, setAllBalances] = useState();
  const [allStaking, setAllStaking] = useState();

  useEffect(() => {
    if (isReady) {
      const balanceSub = combineLatest([
        api.derive.balances.all(address),
        api.derive.staking.account(address),
      ]).subscribe(([allBalances, allStaking]) => {
        setAllBalances(allBalances);
        setAllStaking(allStaking);
      });

      return (): void => balanceSub.unsubscribe();
    }
  }, [api, isReady, address]);

  const handleRedeem = (address: string): void => {
    // FIXME We're not unsubscring here, we should
    of(api.tx.staking.withdrawUnbonded(address)).subscribe();
  };

  return (
    <BalanceDisplay
      allBalances={allBalances}
      allStaking={allStaking}
      detailed={detailed}
      orientation={orientation}
      handleRedeem={handleRedeem}
      {...rest}
    />
  );
}
