// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import { ApiRxContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { Container } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';

import { SubHeader, Text, ValidatorsTable } from '../components';
import { LATEST_SESSION_QUERY } from '../util/graphql';

const CurrentElectedList = (): React.ReactElement => {
  const { api } = useContext(ApiRxContext);
  const [currentSession, setCurrentSession] = useState<number>();

  const sessionQueryData = useQuery(LATEST_SESSION_QUERY);

  useEffect(() => {
    if (sessionQueryData && sessionQueryData.data) {
      const {
        data: { sessions },
      } = sessionQueryData;

      setCurrentSession(sessions[0].index);
    }
  }, [sessionQueryData]);

  return (
    <Container>
      <SubHeader>Session:</SubHeader>
      <Text>{currentSession?.toString()}</Text>
      {currentSession ? (
        <ValidatorsTable api={api} currentSession={currentSession} />
      ) : (
        <Spinner active inline />
      )}
    </Container>
  );
};

export default CurrentElectedList;
