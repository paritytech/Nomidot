// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import { AccountsContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import React, { useContext } from 'react';

import { AddressSummary, Tc } from '../index';
import { StashColumnProps } from './types';

const StashColumn = (props: StashColumnProps): React.ReactElement => {
  const { account, api } = props;
  const {
    state: { allAccounts, allStashes },
  } = useContext(AccountsContext);

  const thisInjectedStash = allAccounts.find(
    (injectedAccount: InjectedAccountWithMeta) =>
      injectedAccount.address === account
  );

  return (
    <Tc>
      {!allStashes ? (
        <Spinner active inline />
      ) : (
        <AddressSummary
          address={account}
          api={api}
          name={thisInjectedStash?.meta.name}
          noBalance
          size='tiny'
        />
      )}
    </Tc>
  );
};

export default React.memo(StashColumn);
