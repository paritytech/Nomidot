// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';

import {
  LATEST_SESSION_QUERY
} from '../../../../util/graphql';
import HeaderItem from '../HeaderItem';
import { SessionHead } from '../types';

interface Props {
  inverted?: boolean;
}

const SessionHeader = (props: Props): React.ReactElement => {
  const { inverted = false } = props;
  const queryData = useQuery(LATEST_SESSION_QUERY);
  const [sessionHead, setSessionHead] = useState<SessionHead>();

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
      inverted={inverted}
      title='Session'
      value={sessionHead?.index.toString() || 'fetching...'}
    />
  );
};

export default SessionHeader;
