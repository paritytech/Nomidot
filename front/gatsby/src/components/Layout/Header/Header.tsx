// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery, useSubscription } from '@apollo/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';
import { AccountsContext, ApiContext } from '@substrate/context';
import { Button, ItemStats } from '@substrate/design-system';
import React, { useContext, useEffect, useState } from 'react';

import styles from './Header.module.css';
import { BLOCKS_SUBSCRIPTION, ERAS_SUBSCRIPTION, SESSIONS_SUBSCRIPTION, STAKING_SUBSCRIPTION, LATEST_ERA_QUERY, LATEST_SESSION_QUERY } from './graphql';
import { BlockHead, EraHead, SessionHead, StakingHead } from './types';
import { APP_TITLE, toShortAddress } from '../../../util';

const EraHeader = () => {
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
      const { data: { eras } } = queryData;

      setEraHead({
        index: eras[0].index,
        individualPoints: api.createType('Vec<Points>', eras[0].individualPoints),
        totalPoints: api.createType('Points', eras[0].totalPoints)
      })
    }
  }, [queryData])

  return (
    <>
      <ItemStats
        title='Era Index:'
        subtitle={`total points: ${eraHead ? eraHead.totalPoints.toString() : 'fetching....'}`}
        value={eraHead ? eraHead.index.toString() : 'fetching....'}
      />
    </>
  );
};

const BlockHeader = () => {
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
      subtitle={`authored by: ${blockHead ? toShortAddress(blockHead.authoredBy.toString()) : 'fetching...'}`}
      value={blockHead?.number.toString() || 'fetching...'}
    />
  );
};

const SessionHeader = () => {
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
    if (queryData && queryData.data)  {
      const { data: { sessions } } = queryData;

      setSessionHead({
        index: sessions[0].index
      });
    }
  }, [queryData]);

  return (
    <ItemStats
      title='Session'
      subtitle={null}
      value={sessionHead?.index || 'fetching...'}
    />
  );
};

const StakingHeader = () => {
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
  }, [data, stakeHead]);

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

  async function handleLogin(): Promise<void> {
    try {
      await fetchAccounts();
    } catch (error) {
      window.alert(error.message);
    }
  }

  return (
    <header className={styles.header}>
      <h2>{APP_TITLE}</h2>
      <BlockHeader />
      <EraHeader />
      <SessionHeader />
      <StakingHeader />
      {accounts.length ? (
        <ItemStats
          title='Logged in as:'
          subtitle={toShortAddress(accounts[0].address)}
          value={accounts[0].meta.name}
        />
      ) : (
        <Button onClick={handleLogin}>Login</Button>
      )}
    </header>
  );
}
