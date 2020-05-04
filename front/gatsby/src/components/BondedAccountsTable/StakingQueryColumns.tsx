// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountsContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import React, { useContext } from 'react';

import { AddressSummary, Tc } from '../index';
import { StakingQueryColumnsProps } from './types';

const StakingQueryColumns = (props: StakingQueryColumnsProps): React.ReactElement => {
  const { account, api } = props;
  const {
    state: {
      allAccounts,
      allStashes,
      loadingAccountStaking,
      stashControllerMap,
    },
  } = useContext(AccountsContext);

  const staking = stashControllerMap[account];

  const thisInjectedController = allAccounts.find(
    (injectedAccount: InjectedAccountWithMeta) =>
      injectedAccount.address === account &&
      !allStashes.includes(injectedAccount.address)
  );

  return (
    <>
      <Tc>
        {loadingAccountStaking ? (
          <Spinner active inline />
        ) : !staking ? (
          'no staking info'
        ) : (
          <AddressSummary
            address={
              staking.controllerId?.toHuman && staking.controllerId?.toHuman()
            }
            api={api}
            name={thisInjectedController?.meta.name}
            noBalance
            size='tiny'
          />
        )}
      </Tc>
      <Tc>
        {loadingAccountStaking ? (
          <Spinner inline active />
        ) : !staking ? (
          'no staking info'
        ) : (
          staking.stakingLedger?.active.toHuman &&
          staking.stakingLedger?.active.toHuman()
        )}
      </Tc>
    </>
  );
}

export default React.memo(StakingQueryColumns);
