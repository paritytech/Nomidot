// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import { ApiRx } from '@polkadot/api';
import { formatBalance, hexToBn } from '@polkadot/util';
import { Spinner } from '@substrate/design-system';
import { writeStorage } from '@substrate/local-storage';
import { Icon } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useState, useContext } from 'react';
import shortid from 'shortid';

import { AddressSummary, Table, Tb, Tc, Th, Thead, Tr } from '../components';
import { TableRowData } from '../types';
import { addToCart, joinDataIntoTableRow } from '../util';
import {
  CURRENT_NOMINATIONS,
  CURRENT_VALIDATORS,
  OFFLINE_VALIDATORS,
} from '../util/graphql';
import { AccountsContext } from '@substrate/context';

interface Props {
  api: ApiRx;
  currentSession: number;
}

const ValidatorsTable = (props: Props): React.ReactElement => {
  const { api, currentSession } = props;
  const { state: { extensionNotFound } } = useContext(AccountsContext);
  const [shouldFetch, setShouldFetch] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TableRowData>();

  const currentNominations = useQuery(CURRENT_NOMINATIONS, {
    variables: {
      sessionIndex: currentSession,
    },
  });

  const currentOffline = useQuery(OFFLINE_VALIDATORS, {
    variables: {
      sessionIndex: currentSession,
    },
  });

  const currentValidators = useQuery(CURRENT_VALIDATORS, {
    variables: {
      sessionIndex: currentSession,
    },
  });

  useEffect(() => {
    if (
      api &&
      shouldFetch &&
      currentNominations &&
      currentNominations.data &&
      currentOffline &&
      currentOffline.data &&
      currentValidators &&
      currentValidators.data
    ) {
      const result: TableRowData = joinDataIntoTableRow(
        api,
        currentNominations.data.nominations,
        currentOffline.data.offlineValidators,
        currentValidators.data.validators
      );

      setTableData(result);
      writeStorage('cachedSession', JSON.stringify(currentSession));
      writeStorage('tableData', JSON.stringify(result));
    }
  }, [
    api,
    currentNominations,
    currentOffline,
    currentSession,
    currentValidators,
    shouldFetch,
  ]);

  useEffect(() => {
    const cachedTableDataSession = localStorage.getItem('cachedSession');

    if (
      !cachedTableDataSession ||
      JSON.parse(cachedTableDataSession) !== currentSession
    ) {
      setShouldFetch(true);
    } else {
      const cachedTableData = localStorage.getItem('tableData');

      if (cachedTableData) {
        setTableData(JSON.parse(cachedTableData) as TableRowData);
      }
    }
  }, [currentSession]);

  const handleAddToCart = ({
    currentTarget: {
      dataset: { stash },
    },
  }: React.MouseEvent<HTMLButtonElement>): void => {
    if (stash) {
      addToCart(stash);
    } else {
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Was Offline</Th>
          <Th>Validator Stash</Th>
          <Th>Validator Controller</Th>
          <Th>Nominators</Th>
          <Th>Staked Amount</Th>
          <Th>Commission</Th>
          <Th> </Th>
        </Tr>
      </Thead>
      <Tb>
        {tableData ? (
          Object.values(tableData).map(
            ({
              validatorController,
              validatorStash,
              nominators,
              stakedAmount,
              preferences,
              wasOfflineThisSession,
            }) => {
              return (
                <Tr key={shortid.generate()}>
                  <Tc>{JSON.stringify(wasOfflineThisSession)}</Tc>
                  <Tc>
                    <AddressSummary
                      address={validatorStash}
                      api={api}
                      size='small'
                      noBalance
                      noPlaceholderName
                    />
                  </Tc>
                  <Tc>
                    <AddressSummary
                      address={validatorController}
                      api={api}
                      size='small'
                      noBalance
                      noPlaceholderName
                    />
                  </Tc>
                  <Tc>{nominators.length}</Tc>
                  <Tc>
                    {stakedAmount instanceof BN
                      ? formatBalance(stakedAmount)
                      : formatBalance(hexToBn(stakedAmount))}
                  </Tc>
                  <Tc>
                    {preferences
                      ? formatBalance(
                          api
                            .createType('ValidatorPrefs', preferences)
                            .commission.toString()
                        )
                      : '0'}
                  </Tc>
                  <Tc>
                    {
                      !extensionNotFound &&  <Icon
                      onClick={handleAddToCart}
                      data-stash={validatorStash}
                      name='add to cart'
                    />
                    }
                   
                  </Tc>
                </Tr>
              );
            }
          )
        ) : (
          <Spinner inline />
        )}
      </Tb>
    </Table>
  );
};

export default React.memo(ValidatorsTable);
