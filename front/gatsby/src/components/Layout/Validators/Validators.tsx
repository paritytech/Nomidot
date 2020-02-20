// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';

import { LATEST_SESSION_QUERY } from '../graphql';
import { CurrentElectedList } from './CurrentElected';

export const Validators = (): React.ReactElement => {
  const { data } = useQuery(LATEST_SESSION_QUERY, {
    pollInterval: 10000,
  });
  const [sessionIndex, setSessionIndex] = useState<number>();

  useEffect(() => {
    if (data) {
      const { sessions } = data;

      const index = sessions[0].index;

      setSessionIndex(index);
    }
  }, [data]);

  return (
    <>
      {sessionIndex ? (
        <CurrentElectedList sessionIndex={sessionIndex} />
      ) : (
        '...Loading...'
      )}
    </>
  );
};
