// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import { formatBalance } from '@polkadot/util';
import { ApiRxContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { Container, FadedText } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import shortid from 'shortid';

import {
  AddressSummary,
  Button,
  Table,
  Thead,
  Th,
  Tb,
  Tr,
  Tc
 } from '../components';
import { OfflineValidator, Validator } from '../types';
import { addToCart } from '../util';
import {
  CURRENT_ELECTED,
  OFFLINE_VALIDATORS,
} from '../util/graphql';

interface JoinValidatorOffline extends Validator {
  wasOfflineThisSession: boolean;
}

const CurrentElectedList = (): React.ReactElement => {
  const { api } = useContext(ApiRxContext);

  const [currentElected, setCurrentElected] = useState<
    JoinValidatorOffline[]
  >();

  const currentValidators = useQuery(CURRENT_ELECTED);

  const currentOffline = useQuery(OFFLINE_VALIDATORS);

  useEffect(() => {
    if (currentValidators.data && currentValidators.data.validators) {
      const result: JoinValidatorOffline[] = [];

      /*
       * in theory not great, but unnoticeable in practice
       * O(N*M) where N = |validators|, M = |offline|
       */
      if (currentOffline.data && currentOffline.data.offlineValidators) {
        currentValidators.data.validators.map((validator: Validator) => {
          currentOffline.data.offlineValidators.map(
            (offline: OfflineValidator) => {
              if (
                validator.stash === offline.validatorId ||
                validator.controller === offline.validatorId
              ) {
                result.push({
                  ...validator,
                  wasOfflineThisSession: true,
                });
              } else {
                result.push({
                  ...validator,
                  wasOfflineThisSession: false,
                });
              }
            }
          );
        });
      } else {
        currentValidators.data.validators.map((validator: Validator) => {
          result.push({
            ...validator,
            wasOfflineThisSession: false,
          });
        });
      }
      setCurrentElected(result);
    }
  }, [currentValidators, currentOffline]);

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

  const renderValidatorsTable = (): React.ReactElement => {
    return (
      <Table>
        <Thead>
          <Tr>
            <Th> Offline </Th>
            <Th>Stash</Th>
            <Th>Controller</Th>
            <Th>Commission</Th>
            <Th> </Th>
          </Tr>
        </Thead>
        <Tb>
          {currentElected ? (
            currentElected.map(
              ({ stash, controller, preferences, wasOfflineThisSession }) => (
                <Tr key={shortid.generate()}>
                  <Tc>
                    <FadedText>
                      {JSON.stringify(wasOfflineThisSession)}
                    </FadedText>
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
                    <Button onClick={handleAddToCart} data-stash={stash}>
                      {' '}
                      Add To Cart{' '}
                    </Button>
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

  return <Container>{renderValidatorsTable()}</Container>;
};

export default CurrentElectedList;
