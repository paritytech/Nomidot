// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {
  DeriveBalancesAll,
  DeriveStakingAccount,
} from '@polkadot/api-derive/types';
import { formatBalance } from '@polkadot/util';
import { Spinner } from '@substrate/design-system';
import React from 'react';
import styled from 'styled-components';

import { SubHeader, Text } from '../index';

const Div = styled.div`
  display: flex column;
  justify-content: flex-start;
  align-items: center;
`;

export type BalanceDisplayProps = {
  allBalances?: DeriveBalancesAll;
  allStaking?: DeriveStakingAccount;
  detailed?: boolean;
};

const defaultProps = {
  detailed: false,
};

export function BalanceDisplay(
  props: BalanceDisplayProps = defaultProps
): React.ReactElement {
  const { allBalances } = props;

  return (
    <>
      {allBalances ? (
        <Div>
          <SubHeader>Total Balance:</SubHeader>
          <Text>
            {allBalances.freeBalance
              ? formatBalance(allBalances.freeBalance)
              : null}
          </Text>
        </Div>
      ) : (
        <Spinner active inline />
      )}
    </>
  );
}

{
  /* {detailed && allBalances && renderDetailedBalances()} */
}
