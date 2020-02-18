// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useSubscription, useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';
import { CURRENT_ELECTED } from '../graphql';

interface Props {
  sessionIndex: number;
}

export const CurrentElectedList = (props: Props) => {
  const { sessionIndex } = props;
  const [currentElected, setCurrentElected] = useState<Array<any>>();
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

  const renderValidatorsList = () => {
    return (
      <ul>
        {
          currentElected?.map(validator => {
            <li>{validator.controller}</li>
          })
        }
      </ul>
    )
  }

  return (
    <>
      {
        loading
          ? 'Loading....'
          : renderValidatorsList()
      }
    </>
  );
};
