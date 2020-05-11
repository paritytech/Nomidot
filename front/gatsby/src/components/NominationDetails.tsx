// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { formatBalance } from '@polkadot/util';
import { ApiRxContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { calcRewards } from '../util';
import { AccountsDropdown, StatItem, SubHeader } from './index';

const ContentArea = styled.div`
  display: flex column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 2rem;
`;

const SummaryDiv = styled.div`
  display: flex column;
  justify-content: space-around;
  align-items: flex-start;
`;

const SummaryDivItem = styled.div`
  flex: 1;
  margin: 4px 3px;
  padding: 7px 0;
`;

const EstimationDiv = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 4px 3px;
  padding: 7px 0;

  > h2 {
    flex: 1;
    margin: 0;
  }
`;

interface Props {
  impliedStash?: string;
  nominationAmount?: BN;
}

export const NominationDetails = (props: Props): React.ReactElement => {
  const { impliedStash, nominationAmount } = props;
  const { bondingDuration } = useContext(ApiRxContext);
  const [estimatedReward, setEstimatedReward] = useState<BN>();
  const [rate, setRate] = useState<number>();

  useEffect(() => {
    if (nominationAmount) {
      // FIXME
      const rate = calcRewards();

      setRate(rate);
      setEstimatedReward(nominationAmount.muln(rate));
    }
  }, [nominationAmount, rate]);

  return (
    <ContentArea>
      <SummaryDiv>
        <SummaryDivItem>
          <StatItem title='Nominate with Controller: '>
            <AccountsDropdown onlyControllers />
          </StatItem>
        </SummaryDivItem>
        <SummaryDivItem>
          <StatItem title='Implied Stash: '>
            {impliedStash ? impliedStash : <Spinner active inline />}
          </StatItem>
        </SummaryDivItem>
        <SummaryDivItem>
          <StatItem
            title='Bonding Duration: '
            value={`${bondingDuration} eras`}
          />
        </SummaryDivItem>
      </SummaryDiv>

      <SubHeader>Estimated Rewards: </SubHeader>
      <EstimationDiv>
        <StatItem title='Rate' value={rate ? rate.toString() : '0'} />
        <StatItem
          title='Value'
          value={estimatedReward ? formatBalance(estimatedReward) : '0'}
        />
      </EstimationDiv>
    </ContentArea>
  );
};
