// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import { formatBalance } from '@polkadot/util';
import { ApiContext } from '@substrate/context';
import { Button, Spinner } from '@substrate/design-system';
import {
  AddressSummary,
  Container,
  FadedText,
  Grid,
  Table,
} from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import shortid from 'shortid';

import { CURRENT_ELECTED } from '../graphql';
import { Validator } from './types';

interface Props {
  sessionIndex: number;
}

export const CurrentElectedList = (props: Props): React.ReactElement => {
  const { sessionIndex } = props;
  const { api } = useContext(ApiContext);
  const [currentElected, setCurrentElected] = useState<Array<Validator>>();
  const { data } = useQuery(CURRENT_ELECTED, {
    variables: { sessionIndex },
  });

  useEffect(() => {
    if (data) {
      const { validators } = data;
      console.log(validators);
      setCurrentElected(validators);
    }
  }, [data]);

  const handleAddToCart = (): void => {
    // do nothing for now
    console.log('todo: handle add to cart');
  };

  const renderValidatorsTable = (): React.ReactElement => {
    return (
      <Table celled collapsing padded='very' striped size='large' width='100%'>
        <Table.Header fullWidth>
          <Table.Row>
            <Table.HeaderCell> Offline </Table.HeaderCell>
            <Table.HeaderCell>Stash</Table.HeaderCell>
            <Table.HeaderCell>Controller</Table.HeaderCell>
            <Table.HeaderCell>Commission</Table.HeaderCell>
            <Table.HeaderCell> Bonded </Table.HeaderCell>
            <Table.HeaderCell> </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {currentElected ? (
            currentElected.map(({ stash, controller, preferences }) => (
              <Table.Row textAlign='center' key={shortid.generate()}>
                <Table.Cell textAlign='center'>
                  <FadedText>false</FadedText>
                </Table.Cell>
                <Table.Cell textAlign='center'>
                  <AddressSummary
                    address={stash}
                    size='small'
                    noBalance
                    noPlaceholderName
                  />
                </Table.Cell>
                <Table.Cell textAlign='center'>
                  <AddressSummary
                    address={controller}
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
                  <FadedText>bnonded amount</FadedText>
                </Table.Cell>
                <Table.Cell textAlign='center'>
                  <Button type='pilled' onClick={handleAddToCart}>
                    {' '}
                    Add To Cart{' '}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Spinner inline />
          )}
        </Table.Body>
      </Table>
    );
  };

  return (
    <Container>
      <Grid container>
        {currentElected ? (
          <Grid.Row style={{ minWidth: '100%' }} padded='very' centered>
            {renderValidatorsTable()}
          </Grid.Row>
        ) : (
          <Spinner inline />
        )}
      </Grid>
    </Container>
  );
};
