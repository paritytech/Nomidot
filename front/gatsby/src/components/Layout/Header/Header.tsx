// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useSubscription } from '@apollo/react-hooks';
import { AccountsContext } from '@substrate/context';
import { Button, ItemStats } from '@substrate/design-system';
import gql from 'graphql-tag';
import React, { useContext, useEffect, useState } from 'react';

import { APP_TITLE, toShortAddress } from '../../../util';
import styles from './Header.module.css';
import { BlockHead, EraHead, SessionHead } from './types';

const BLOCKS_SUBSCRIPTION = gql`
  subscription {
    subscribeBlockNumbers {
      authoredBy
      hash
      number
      startDateTime
    }
  }
`;

const ERAS_SUBSCRIPTION = gql`
  subscription {
    subscribeEras {
      index
      totalPoints
    }
  }
`;

const SESSIONS_SUBSCRIPTION = gql`
  subscription {
    subscribeSessions {
      index
    }
  }
`;

// const STAKING_SUBSCRIPTION = gql`
//   subscription {
//   }
// `;

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
  }, [data]);

  return (
    <>
      <ItemStats
        title='Era Index:'
        subtitle={null}
        value={eraHead ? eraHead.index : 'fetching....'}
      />
      <ItemStats
        title='Era Points:'
        subtitle={null}
        value={eraHead ? eraHead.totalPoints : 'fetching....'}
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
  }, [data]);

  return (
    <ItemStats
      title='block #'
      subtitle='/target 6s'
      value={blockHead || 'fetching...'}
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
  }, [data]);

  return (
    <ItemStats
      title='Session'
      subtitle={null}
      value={sessionHead || 'fetching...'}
    />
  );
};

// const StakingHeader = () => {
//   const { data } = useSubscription(STAKING_SUBSCRIPTION);
// };

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
