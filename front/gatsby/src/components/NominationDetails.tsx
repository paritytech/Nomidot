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

const Div = styled.div`
  display: flex column;
  justify-content: space-around;
  align-items: flex-start;
`;

const DivItem = styled.div`
  flex: 1;
  margin: 4px 3px;
  padding: 7px 0;
`;

const DivItemMulti = styled.div`
  flex: 1;
  display: flex;
  margin: 4px 3px;
  justify-content: space-around;
  align-items: flex-start;
  padding: 7px 0;
`;

interface Props {
  allFees?: BN;
  impliedStash?: string;
  nominationAmount?: BN;
}

export const NominationDetails = (props: Props): React.ReactElement => {
  const { allFees, impliedStash, nominationAmount } = props;
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
      <Div>
        <DivItem>
          <StatItem title='Nominate with Controller: '>
            <AccountsDropdown onlyControllers />
          </StatItem>
        </DivItem>
        <DivItem>
          <StatItem title='Implied Stash: '>
            {impliedStash ? impliedStash : <Spinner active inline />}
          </StatItem>
        </DivItem>
        <DivItemMulti>
          <StatItem
            title='Bonding Duration: '
            value={`${bondingDuration} eras`}
          />
          <StatItem
            title='Nomination Amount: '
            value={`${formatBalance(nominationAmount)}`}
          />
          <StatItem
            title='Txn Fees: '
            value={`${formatBalance(allFees)}`}
          />
        </DivItemMulti>
      </Div>

      <SubHeader>Estimated Rewards: </SubHeader>
      <Div>
        <DivItemMulti>
          <StatItem title='Rate' value={rate ? rate.toString() : '0'} />
          <StatItem
            title='Value'
            value={estimatedReward ? formatBalance(estimatedReward) : '0'}
          />
        </DivItemMulti>
      </Div>
    </ContentArea>
  );
};
