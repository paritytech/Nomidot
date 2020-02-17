// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery, useSubscription } from '@apollo/react-hooks';
import { AccountsContext, ApiContext } from '@substrate/context';
import { Button, ItemStats } from '@substrate/design-system';
import React, { useContext, useEffect, useState } from 'react';

import styles from './Header.module.css';
import { BLOCKS_SUBSCRIPTION, ERAS_SUBSCRIPTION, SESSIONS_SUBSCRIPTION, STAKING_SUBSCRIPTION } from './graphql';
import { BlockHead, EraHead, SessionHead, StakingHead } from './types';
import { APP_TITLE, toShortAddress } from '../../../util';

const EraHeader = () => {
  const { data } = useSubscription(ERAS_SUBSCRIPTION);
  const [eraHead, setEraHead] = useState<EraHead>();

  useEffect(() => {
    if (data) {
      const {
        subscribeEras: { index, totalPoints },
      } = data;

      if (!eraHead || index > eraHead.index) {
        setEraHead({
          index,
          totalPoints,
        });
      }
    }
  }, [data, eraHead]);

  return (
    <>
      <ItemStats
        title='Era Index:'
        subtitle={null}
        value={eraHead ? eraHead.index.toString() : 'fetching....'}
      />
      <ItemStats
        title='Era Points:'
        subtitle={null}
        value={eraHead ? eraHead.totalPoints.toString() : 'fetching....'}
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
          totalStake: api.createType('Balance', totalStake).toString(),
        });
      }
    }
  }, [data, stakeHead]);

  return (
    <ItemStats
      title='Total Stake'
      subtitle={null}
      value={stakeHead?.totalStake || 'fetching...'}
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
