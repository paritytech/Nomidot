// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import { formatBalance } from '@polkadot/util';
import { Button, Spinner } from '@substrate/design-system';
import { ApiContext } from '@substrate/context';
import  { AddressSummary, Container, Grid, Table } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';

import { CURRENT_ELECTED } from '../graphql';
import { Validator } from './types';

interface Props {
  sessionIndex: number;
}

export const CurrentElectedList = (props: Props) => {
  const { sessionIndex } = props;
  const { api } = useContext(ApiContext);
  const [currentElected, setCurrentElected] = useState<Array<Validator>>();
  const { data, loading, error } = useQuery(CURRENT_ELECTED, {
    variables: { sessionIndex }
  });

  useEffect(() => {
    if (data) {
      const { validators } = data;
      console.log(validators);
      setCurrentElected(validators);
    }
  }, [data]);

  const handleAddToCart = () => {
    // do nothing for now
    console.log('todo: handle add to cart');
  }

  const renderValidatorsTable = () => {
    return (
      <Table basic='very' celled collapsing padded selectable width='100%'>
        <Table.Header fullWidth>
          <Table.HeaderCell >Stash</Table.HeaderCell>
          <Table.HeaderCell >Controller</Table.HeaderCell>
          <Table.HeaderCell >Commission</Table.HeaderCell>
          <Table.HeaderCell> Bonded </Table.HeaderCell>
          <Table.HeaderCell> Action </Table.HeaderCell>
        </Table.Header>
        <Table.Body>
        {
          currentElected
            ?  currentElected.map(({ stash, controller, preferences }) => (
                <Table.Row textAlign='center'>
                  <Table.Cell ><AddressSummary address={stash} size='tiny' noBalance noPlaceholderName /></Table.Cell>
                  <Table.Cell><AddressSummary address={controller} size='tiny' noBalance noPlaceholderName /></Table.Cell>
                  <Table.Cell>{formatBalance(api.createType('ValidatorPrefs', preferences).commission.toString())}</Table.Cell>
                  <Table.Cell>bonded amount</Table.Cell>
                  <Table.Cell> <Button onClick={handleAddToCart}> Add To Cart </Button></Table.Cell>
                </Table.Row>
            ))
            : <Spinner />
        }
        </Table.Body>
      </Table>
    )
  }

  return (
    <Grid container>
      {
        currentElected
          ? (
            <Grid.Row>
              <h2>Current Elected Validators</h2>
              <Grid.Row style={{ minWidth: '100%' }}>
                {renderValidatorsTable()}
              </Grid.Row>
            </Grid.Row>
          )
          : <Spinner inline />
      }
    </Grid>
  )
};
