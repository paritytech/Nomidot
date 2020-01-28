// Copyright 2018-2020 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStakingOverview } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';
import { ApiContext } from '@substrate/context';
import { AddressSummary, List } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import { take } from 'rxjs/operators';

import SEO from './seo';

function ValidatorsList(): React.ReactElement {
  const { api, isReady } = useContext(ApiContext);

  const [stakingOverview, setStakingOverview] = useState<DerivedStakingOverview>();
  const [validators, setValidators] = useState<AccountId[] | null>();
  
  useEffect(() => {
    if (api && isReady) {
      const sub = api.derive.staking.overview()
        .pipe(
          take(1)
        ).subscribe((_stakingOverview: DerivedStakingOverview) => {
          setStakingOverview(_stakingOverview);
          setValidators(stakingOverview?.validators);
          console.log(validators);
        });
  
      return () => sub.unsubscribe();
    }
  }, [api, isReady]);

  return (
    <>
      <SEO title='Kusama Validators'/>
      <List>
        {
          validators && validators.map((validator: AccountId) => {
            return (
              <>
                <AddressSummary address={validator.toString()} orientation='vertical' size='tiny' />
                <List.Item>
                  <List.Content>
                    <List.Header>{validator.toString()}</List.Header>
                  </List.Content>
                </List.Item>
              </>
            )
          })
        }
      </List>
    </>
  );
}

export default ValidatorsList;
