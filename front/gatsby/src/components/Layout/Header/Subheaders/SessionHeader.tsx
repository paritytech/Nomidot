// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery, useSubscription } from '@apollo/react-hooks';
import { ItemStats } from '@substrate/design-system';
import React, { useEffect, useState } from 'react';

import HeaderItem from '../HeaderItem';
import {
  LATEST_SESSION_QUERY,
  SESSIONS_SUBSCRIPTION,
} from '../../../../util/graphql';
import { SessionHead } from '../types';

const SessionHeader = (): React.ReactElement => {
  const queryData = useQuery(LATEST_SESSION_QUERY);
  const { data } = useSubscription(SESSIONS_SUBSCRIPTION);
  const [sessionHead, setSessionHead] = useState<SessionHead>();

  useEffect(() => {
    if (data) {
      const {
        subscribeSessions: { index },
      } = data;

      if (!sessionHead || index > sessionHead.index) {
        setSessionHead({
          index,
        });
      }
    }
  }, [data, sessionHead]);

  useEffect(() => {
    if (queryData && queryData.data) {
      const {
        data: { sessions },
      } = queryData;

      setSessionHead({
        index: sessions[0].index,
      });
    }
  }, [queryData]);

  return (
    <HeaderItem
      title='Session'
      value={sessionHead?.index.toString() || 'fetching...'}
    />
  );
};

export default SessionHeader;
