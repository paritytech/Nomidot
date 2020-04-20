// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useSubscription } from '@apollo/react-hooks';
import { formatBalance } from '@polkadot/util';
import { ApiRxContext } from '@substrate/context';
import React, { useContext, useEffect, useState } from 'react';

import { STAKING_SUBSCRIPTION } from '../../../../util/graphql';
import HeaderItem from '../HeaderItem';
import { StakingHead } from '../types';

const StakingHeader = (): React.ReactElement => {
  const { data } = useSubscription(STAKING_SUBSCRIPTION);
  const [stakeHead, setStakeHead] = useState<StakingHead>();
  const { api } = useContext(ApiRxContext);

  useEffect(() => {
    if (data) {
      const {
        subscribeStakes: {
          blockNumber: { number },
          totalStake,
        },
      } = data;

      if (!stakeHead || stakeHead.blockNumber > number) {
        setStakeHead({
          blockNumber: number,
          totalStake,
        });
      }
    }
  }, [api, data, stakeHead]);

  return (
    <HeaderItem
      title='Total Stake'
      subtitle={null}
      value={stakeHead ? formatBalance(stakeHead.totalStake) : 'fetching...'}
    />
  );
};

export default StakingHeader;
