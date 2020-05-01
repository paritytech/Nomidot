// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery, useSubscription } from '@apollo/react-hooks';
import { formatBalance } from '@polkadot/util';
import { ApiRxContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import {
  Container,
  FadedText,
  Table,
} from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import shortid from 'shortid';

import { AddressSummary, Button } from '../components';
import { OfflineValidator, Validator } from '../types';
import { addToCart } from '../util';
import {
  CURRENT_ELECTED,
  OFFLINE_VALIDATORS,
  SESSIONS_SUBSCRIPTION,
} from '../util/graphql';

interface JoinValidatorOffline extends Validator {
  wasOfflineThisSession: boolean;
}

const CurrentElectedList = (): React.ReactElement => {
  const { api } = useContext(ApiRxContext);

  const [currentElected, setCurrentElected] = useState<
    JoinValidatorOffline[]
  >();

  const [sessionIndex, setSessionIndex] = useState(0);

  const currentValidators = useQuery(CURRENT_ELECTED);

  const currentOffline = useQuery(OFFLINE_VALIDATORS);

  const currentSession = useSubscription(SESSIONS_SUBSCRIPTION);

  useEffect(() => {
    if (currentSession && currentSession.data) {
      const { sessions } = currentSession.data;

      const index = sessions[0].index;

      setSessionIndex(index);
    }
  }, [currentSession]);

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
      <Table celled padded striped size='large'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell> Offline </Table.HeaderCell>
            <Table.HeaderCell>Stash</Table.HeaderCell>
            <Table.HeaderCell>Controller</Table.HeaderCell>
            <Table.HeaderCell>Commission</Table.HeaderCell>
            <Table.HeaderCell> </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentElected ? (
            currentElected.map(
              ({ stash, controller, preferences, wasOfflineThisSession }) => (
                <Table.Row textAlign='center' key={shortid.generate()}>
                  <Table.Cell textAlign='center'>
                    <FadedText>
                      {JSON.stringify(wasOfflineThisSession)}
                    </FadedText>
                  </Table.Cell>
                  <Table.Cell textAlign='center'>
                    <AddressSummary
                      address={stash}
                      api={api}
                      size='small'
                      noBalance
                      noPlaceholderName
                    />
                  </Table.Cell>
                  <Table.Cell textAlign='center'>
                    <AddressSummary
                      address={controller}
                      api={api}
                      size='small'
                      noBalance
                      noPlaceholderName
                    />
                  </Table.Cell>
                  <Table.Cell textAlign='center'>
                    <FadedText>
                      {formatBalance(
                        api
                          .createType('ValidatorPrefs', preferences)
                          .commission.toString()
                      )}
                    </FadedText>
                  </Table.Cell>
                  <Table.Cell textAlign='center'>
                    <Button onClick={handleAddToCart} data-stash={stash}>
                      {' '}
                      Add To Cart{' '}
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )
            )
          ) : (
            <Spinner inline />
          )}
        </Table.Body>
      </Table>
    );
  };

  return (
    <Container>
      {renderValidatorsTable()}
    </Container>
  );
};

export default CurrentElectedList;
