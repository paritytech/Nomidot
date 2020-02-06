// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery, useSubscription } from '@apollo/react-hooks';
import { AccountsContext } from '@substrate/context';
import gql from 'graphql-tag';
import React, { useContext } from 'react';

import { APP_TITLE } from '../../../util';
import styles from './Header.module.css';

const BLOCKS_SUBSCRIPTION = gql`
  {
    subscribeBlockNumbers {
      authoredBy
      hash
      number
    }
  }
`

// const ERAS_SUBSCRIPTION = gql`
//   {
//     subscription subscribeEras {
//       index
//       totalPoints
//     }
//   }
// `

// const EraHeader = () => {
//   const { loading, error, data } = useSubscription(ERAS_SUBSCRIPTION);

//   console.log(data);

//   return (
//     <div>
//       {data}
//     </div>
//   );
// }

const BlockHeader = () => {
  const { loading, error, data } = useSubscription(BLOCKS_SUBSCRIPTION);

  console.log(data);

  return (
    <div>
      {data}
    </div>
  )
}

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
      {/* <EraHeader /> */}
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
