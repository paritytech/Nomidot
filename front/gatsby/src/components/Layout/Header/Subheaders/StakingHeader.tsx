// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import { formatBalance } from '@polkadot/util';
import React, { useEffect, useState } from 'react';

import { LATEST_STAKE } from '../../../../util/graphql';
import HeaderItem from '../HeaderItem';
import { StakingHead } from '../types';

interface Props {
  inverted?: boolean;
}

const StakingHeader = (props: Props): React.ReactElement => {
  const { inverted } = props;
  const queryData = useQuery(LATEST_STAKE);
  const [stakeHead, setStakeHead] = useState<StakingHead>();

  useEffect(() => {
    if (queryData && queryData.data) {
      const {
        data: { stakes },
      } = queryData;

      setStakeHead({
        blockNumber: stakes[0].number,
        totalStake: stakes[0].totalStake,
      });
    }
  }, [queryData]);

  return (
    <HeaderItem
      inverted={inverted}
      title='Total Stake'
      subtitle={null}
      value={stakeHead ? formatBalance(stakeHead.totalStake) : 'fetching...'}
    />
  );
};

export default StakingHeader;
