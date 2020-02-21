// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery, useSubscription } from '@apollo/react-hooks';
import { formatBalance } from '@polkadot/util';
import { AccountsContext, ApiContext } from '@substrate/context';
import { Button, ItemStats, MainMenu } from '@substrate/design-system';
import { AddressSummary } from '@substrate/ui-components';
import { navigate } from 'gatsby';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import shortid from 'shortid';

import { APP_TITLE, toShortAddress } from '../../../util';
import {
  BLOCKS_SUBSCRIPTION,
  ERAS_SUBSCRIPTION,
  LATEST_ERA_QUERY,
  LATEST_SESSION_QUERY,
  SESSIONS_SUBSCRIPTION,
  STAKING_SUBSCRIPTION,
} from '../../../util/graphql';
import { BlockHead, EraHead, SessionHead, StakingHead } from './types';

const EraHeader = (): React.ReactElement => {
  const { api } = useContext(ApiContext);
  const { data } = useSubscription(ERAS_SUBSCRIPTION);
  const queryData = useQuery(LATEST_ERA_QUERY);
  const [eraHead, setEraHead] = useState<EraHead>();

  useEffect(() => {
    if (data) {
      const {
        subscribeEras: { index, individualPoints, totalPoints },
      } = data;

      if (!eraHead || index > eraHead.index) {
        setEraHead({
          index,
          individualPoints,
          totalPoints,
        });
      }
    }
  }, [data, eraHead]);

  useEffect(() => {
    if (queryData && queryData.data) {
      const {
        data: { eras },
      } = queryData;

      setEraHead({
        index: eras[0].index,
        individualPoints: api.createType(
          'Vec<Points>',
          eras[0].individualPoints
        ),
        totalPoints: api.createType('Points', eras[0].totalPoints),
      });
    }
  }, [api, queryData]);

  return (
    <>
      <ItemStats
        title='Era Index:'
        subtitle={`total points: ${
          eraHead ? eraHead.totalPoints.toString() : 'fetching....'
        }`}
        value={eraHead ? eraHead.index.toString() : 'fetching....'}
      />
    </>
  );
};

const BlockHeader = (): React.ReactElement => {
  const { data } = useSubscription(BLOCKS_SUBSCRIPTION);
  const [blockHead, setBlockHead] = useState<BlockHead>();

  useEffect(() => {
    if (data) {
      const {
        subscribeBlockNumbers: { number, authoredBy, hash, startDateTime },
      } = data;

      if (!blockHead || number > blockHead.number) {
        setBlockHead({
          authoredBy,
          hash,
          number,
          startDateTime,
        });
      }
    }
  }, [blockHead, data]);

  return (
    <ItemStats
      title='block #'
      subtitle={`authored by: ${
        blockHead
          ? toShortAddress(blockHead.authoredBy.toString())
          : 'fetching...'
      }`}
      value={blockHead?.number.toString() || 'fetching...'}
    />
  );
};

const SessionHeader = (): React.ReactElement => {
  const queryData = useQuery(LATEST_SESSION_QUERY);
  const { data } = useSubscription(SESSIONS_SUBSCRIPTION);
  const [sessionHead, setSessionHead] = useState<SessionHead>();

  useEffect(() => {
    if (data) {
      const {
        subscribeSessions: { index },
      } = data;

      if (!sessionHead || index > sessionHead.index) {
        setSessionHead({
          index,
        });
      }
    }
  }, [data, sessionHead]);

  useEffect(() => {
    if (queryData && queryData.data) {
      const {
        data: { sessions },
      } = queryData;

      setSessionHead({
        index: sessions[0].index,
      });
    }
  }, [queryData]);

  return (
    <ItemStats
      title='Session'
      subtitle={null}
      value={sessionHead?.index.toString() || 'fetching...'}
    />
  );
};

const StakingHeader = (): React.ReactElement => {
  const { data } = useSubscription(STAKING_SUBSCRIPTION);
  const [stakeHead, setStakeHead] = useState<StakingHead>();
  const { api } = useContext(ApiContext);

  useEffect(() => {
    if (data) {
      const {
        subscribeStakes: {
          blockNumber: { number },
          totalStake,
        },
      } = data;

      if (!stakeHead || stakeHead.blockNumber > number) {
        setStakeHead({
          blockNumber: number,
          totalStake: api.createType('Balance', totalStake),
        });
      }
    }
  }, [api, data, stakeHead]);

  return (
    <ItemStats
      title='Total Stake'
      subtitle={null}
      value={stakeHead ? formatBalance(stakeHead.totalStake) : 'fetching...'}
    />
  );
};

export function Header(): React.ReactElement {
  const { accounts, fetchAccounts } = useContext(AccountsContext);

  const handleLogin = useCallback(async () => {
    try {
      await fetchAccounts();
    } catch (error) {
      window.alert(error.message);
    }
  }, [fetchAccounts]);

  useEffect(() => {
    handleLogin();
  }, []);

  return (
    <>
      <MainMenu
        contentLeft={<h2>{APP_TITLE}</h2>}
        contentRight={
          <>
            {accounts.length ? (
              <div>
                <AddressSummary
                  address={accounts[0].address}
                  name={accounts[0].meta.name}
                  noBalance
                  size='small'
                />
              </div>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
          </>
        }
        tabs={[
          <Button
            key={shortid.generate()} // FIXME: why do i need a key here...
            onClick={() => {
              navigate(`AccountsList`);
            }}
          >
            Accounts
          </Button>,
          <Button
            key={shortid.generate()} // FIXME: why do i need a key here
            onClick={() => {
              navigate(`Validators`);
            }}
          >
            Validators
          </Button>,
        ]}
      />
      <header style={{ display: 'flex' }}>
        <BlockHeader />
        <EraHeader />
        <SessionHeader />
        <StakingHeader />
      </header>
    </>
  );
}
