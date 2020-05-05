// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import { ApiRx } from '@polkadot/api';
import { ValidatorPrefs } from '@polkadot/types/interfaces';
import { formatBalance } from '@polkadot/util';
import { Spinner } from '@substrate/design-system';
import { FadedText, Icon } from '@substrate/ui-components';
import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import shortid from 'shortid';

import {
  AddressSummary,
  Table,
  Tb,
  Tc,
  Th,
  Thead,
  Tr,
} from '../components';
import { OfflineValidator, Nomination } from '../types';
import { addToCart } from '../util';
import {
  CURRENT_ELECTED,
  CURRENT_NOMINATIONS,
  OFFLINE_VALIDATORS,
} from '../util/graphql';

// TODO also join with prefernces
interface JoinNominationsAndOffline extends Nomination {
  wasOfflineThisSession: boolean;
}

interface TableRowData {
  validatorController: string,
  validatorStash: string,
  nominators: string[], // by stash
  stakedAmount: BN, // sum up all the staked amounts
  // preferences: ValidatorPrefs,
  wasOfflineThisSession: boolean
}

interface Props {
  api: ApiRx;
  currentSession: number;
}

const ValidatorsTable = (props: Props): React.ReactElement => {
  const { api, currentSession } = props;
  const [currentElected, setCurrentElected] = useState<
  JoinNominationsAndOffline[]
  >();

  const [tableData, setTableData] = useState<TableRowData[]>();

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

  useEffect(() => {
    
  }, [currentNominations, currentOffline]);

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
          <Th>Offline </Th>
          <Th>Stash</Th>
          <Th>Controller</Th>
          <Th>Commission</Th>
          <Th> </Th>
        </Tr>
      </Thead>
      <Tb>
        {currentElected ? (
          currentElected.map(
            ({ nominatorStash, nominatorController, validatorStash, validatorController, stakedAmount, wasOfflineThisSession }) => (
              <Tr key={shortid.generate()}>
                <Tc>
                  <FadedText>{JSON.stringify(wasOfflineThisSession)}</FadedText>
                </Tc>
                <Tc>
                  <AddressSummary
                    address={stash}
                    api={api}
                    size='small'
                    noBalance
                    noPlaceholderName
                  />
                </Tc>
                <Tc>
                  <AddressSummary
                    address={controller}
                    api={api}
                    size='small'
                    noBalance
                    noPlaceholderName
                  />
                </Tc>
                <Tc>
                  <FadedText>
                    {formatBalance(
                      api
                        .createType('ValidatorPrefs', preferences)
                        .commission.toString()
                    )}
                  </FadedText>
                </Tc>
                <Tc>
                  <Icon
                    onClick={handleAddToCart}
                    data-stash={stash}
                    name='add to cart'
                  />
                </Tc>
              </Tr>
            )
          )
        ) : (
          <Spinner inline />
        )}
      </Tb>
    </Table>
  );
};

export default React.memo(ValidatorsTable);
