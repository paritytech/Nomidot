// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext, ApiRxContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { Input } from '@substrate/ui-components';
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
  nominationAmount: string;
  handleUserInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const NominationDetails = (props: Props): React.ReactElement => {
  const { handleUserInputChange, nominationAmount } = props;
  const {
    state: { currentAccount, stashControllerMap },
  } = useContext(AccountsContext);
  const { bondingDuration } = useContext(ApiRxContext);
  const [estimatedReward, setEstimatedReward] = useState<BN>();
  const [impliedStash, setImpliedStash] = useState<string>();
  const [rate, setRate] = useState<number>();

  useEffect(() => {
    if (nominationAmount) {
      // FIXME
      const rate = calcRewards();

      setRate(rate);
      setEstimatedReward(new BN(nominationAmount).muln(rate));
    }
  }, [nominationAmount, rate]);

  useEffect(() => {
    const stash = Object.values(stashControllerMap).find(
      derivedStaking =>
        derivedStaking.controllerId?.toHuman() === currentAccount
    )?.stashId;

    setImpliedStash(stash?.toHuman());
  }, [currentAccount, stashControllerMap]);

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
        <StatItem title='Rate' value={rate ? rate.toString() : '0'} />
        <StatItem
          title='Value'
          value={estimatedReward ? estimatedReward.toString() : '0'}
        />
      </EstimationDiv>
    </ContentArea>
  );
};
