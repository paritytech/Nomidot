// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiRxContext } from '@substrate/context';
import { Input } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import media from 'styled-media-query';

import { calcRewards } from '../util';
import { AccountsDropdown, StatItem, SubHeader } from './index';

const ContentArea = styled.div`
  display: flex column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 2rem;

  ${media.lessThan('medium')`
    display: flex column;
  `}
`;

const SummaryDiv = styled.div`
  display: flex column;
  justify-content: space-around;
  align-items: flex-start;
  padding: 10px;
  height: 50%;
`;

const SummaryDivItem = styled.div`
  flex: 1;
  margin: 4px 3px;
  padding: 7px 0;
`;

const EstimationDiv = styled.div`
  flex: 1;
  margin: 4px 3px;
  padding: 7px 0;
`;

interface Props {
  nominationAmount: string;
  handleUserInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NominationDetails = (props: Props): React.ReactElement => {
  const { handleUserInputChange, nominationAmount } = props;

  const { bondingDuration } = useContext(ApiRxContext);
  const [estimatedReward, setEstimatedReward] = useState<BN>();
  const [rate, setRate] = useState<number>();

  useEffect(() => {
    if (nominationAmount) {
      // FIXME
      const rate = calcRewards();

      setRate(rate);
      setEstimatedReward(new BN(nominationAmount).muln(rate));
    }
  }, [nominationAmount, rate]);

  return (
    <ContentArea>
      <SubHeader>Summary: </SubHeader>
      <SummaryDiv>
        <SummaryDivItem>
          <StatItem title='Nominate as: '>
            <AccountsDropdown />
          </StatItem>
        </SummaryDivItem>
        <SummaryDivItem>
          <StatItem
            title='Bonding Duration: '
            value={`${bondingDuration} eras`}
          />
        </SummaryDivItem>
        <SummaryDivItem>
          <StatItem title='Nomination Amount: ' />
          <Input
            fluid
            label='UNIT'
            labelPosition='right'
            min={0}
            onChange={handleUserInputChange}
            placeholder='e.g. 1.00'
            type='number'
            value={nominationAmount}
          />
        </SummaryDivItem>
      </SummaryDiv>

      <SubHeader>Estimated Rewards: </SubHeader>
      <EstimationDiv>
        <StatItem title='Rate' value={rate?.toString()} />
        <StatItem title='Value' value={estimatedReward?.toString()} />
      </EstimationDiv>
    </ContentArea>
  );
};
