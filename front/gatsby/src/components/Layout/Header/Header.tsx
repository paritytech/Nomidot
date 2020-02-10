// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useSubscription } from '@apollo/react-hooks';
import { AccountsContext } from '@substrate/context';
import gql from 'graphql-tag';
import React, { useContext, useEffect, useState } from 'react';

import { APP_TITLE } from '../../../util';
import styles from './Header.module.css';

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

interface EraHead {
  index: number;
  totalPoints: number;
}

const EraHeader = () => {
  const { data } = useSubscription(ERAS_SUBSCRIPTION);
  const [eraHead, setEraHead] = useState<EraHead>({} as EraHead);

  useEffect(() => {
    if (data) {
      const {
        subscribeEras: { index, totalPoints },
      } = data;

      setEraHead({
        index,
        totalPoints,
      });
    }
  }, [data]);

  return (
    <div>
      {eraHead ? (
        <>
          Current era: {eraHead.index}
          Total Points: {eraHead.totalPoints}
        </>
      ) : null}
    </div>
  );
};

interface BlockHead {
  authoredBy: string;
  hash: string;
  number: number;
  startDateTime: string;
}

const BlockHeader = () => {
  const { data } = useSubscription(BLOCKS_SUBSCRIPTION);
  const [blockHead, setBlockHead] = useState<BlockHead>({} as BlockHead);

  useEffect(() => {
    if (data) {
      const {
        subscribeBlockNumbers: { number, authoredBy, hash, startDateTime },
      } = data;

      setBlockHead({
        authoredBy,
        hash,
        number,
        startDateTime,
      });
    }
  }, [data]);

  return (
    <div>
      {blockHead ? (
        <>
          Block #: {blockHead.number}
          Authored By: {blockHead.authoredBy}
          Hash: {blockHead.hash}
        </>
      ) : (
        'nohting to show...'
      )}
    </div>
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
      <EraHeader />
      <BlockHeader />
      {accounts.length ? (
        <span>
          Logged in as {accounts[0].meta.name} ({accounts[0].address})
        </span>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </header>
  );
}
