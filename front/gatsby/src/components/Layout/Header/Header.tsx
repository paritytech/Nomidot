// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext } from '@substrate/context';
import React, { useContext } from 'react';

import { APP_TITLE } from '../../../util';
import styles from './Header.module.css';

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
