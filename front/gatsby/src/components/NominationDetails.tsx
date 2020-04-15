// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EraIndex } from '@polkadot/types/interfaces';
import { ApiContext, handler } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { Input } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import media from 'styled-media-query';

import { AccountsDropdown } from './AccountsDropdown';
import { SubHeader, Text } from './Typography';
import { SubmittableExtrinsic } from '@polkadot/api/types';

const ContentArea = styled.div`
  flex: 1;
  display: flex column;
  justify-content: flex-start;
  align-items: stretch;
`

const SummaryDiv = styled.div`
  display: flex column;
  justify-content: space-around;
  align-items: flex-start;
  padding: 10px;
  height: 250px;
`

const SummaryDivItem = styled.div`
  flex: 1;
  margin: 4px 3px;
  padding: 7px 0;
`

const EstimationDiv = styled.div`

`;

interface Props {
  nominationAmount: string,
  setNominationAmount: React.Dispatch<React.SetStateAction<string>>;
}

export const NominationDetails = (props: Props): React.ReactElement => {
  const { api, apiPromise, isApiReady } = useContext(ApiContext);
  const [bondDuration, setBondDuration] = useState<EraIndex>();

  const fetchStakingConstants = async () => {
    if (isApiReady) {
      const bondingDuration = await apiPromise?.consts.staking.bondingDuration;

      setBondDuration(bondingDuration?.toHuman());
    }
  }
  
  useEffect(() => {
    fetchStakingConstants();
  }, [isApiReady]);
  
  return (
    <ContentArea>
      <SubHeader>Summary: </SubHeader>
      <SummaryDiv>
        <SummaryDivItem>
          <b>Nominate as:</b>
          <AccountsDropdown />  
        </SummaryDivItem>
        <SummaryDivItem>
          <b>Bonding Duration:</b>
          {bondDuration} eras
        </SummaryDivItem>
        <SummaryDivItem>
          <b>Nomination Amount: </b>
          <Input
            fluid
            label='UNIT'
            labelPosition='right'
            min={0}
            onChange={handler(setNominationAmount)}
            placeholder='e.g. 1.00'
            type='number'
            value={nominationAmount}
            />
        </SummaryDivItem>
      </SummaryDiv>

      <SubHeader>Estimated Rewards: </SubHeader>
      <EstimationDiv>
      </EstimationDiv>
  </ContentArea>
  );
};
