// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery, useSubscription } from '@apollo/react-hooks';
import { ApiContext } from '@substrate/context';
import React, { useContext, useEffect, useState } from 'react';

import { ERAS_SUBSCRIPTION, LATEST_ERA_QUERY } from '../../../../util/graphql';
import HeaderItem from '../HeaderItem';
import { EraHead } from '../types';

const EraHeader = (): React.ReactElement => {
  const { api } = useContext(ApiContext);
  const { data } = useSubscription(ERAS_SUBSCRIPTION);
  const queryData = useQuery(LATEST_ERA_QUERY);
  const [eraHead, setEraHead] = useState<EraHead>();

  useEffect(() => {
    if (data) {
      const {
        subscribeEras: { index, individualPoints, totalPoints },
      } = data;

      if (!eraHead || index > eraHead.index) {
        setEraHead({
          index,
          individualPoints,
          totalPoints,
        });
      }
    }
  }, [data, eraHead]);

  useEffect(() => {
    if (queryData && queryData.data) {
      const {
        data: { eras },
      } = queryData;

      setEraHead({
        index: eras[0].index,
        individualPoints: eras[0].individualPoints,
        totalPoints: api.createType('Points', eras[0].totalPoints),
      });
    }
  }, [api, queryData]);

  return (
    <HeaderItem
      title='Era Index:'
      subtitle={`total points: ${
        eraHead ? eraHead.totalPoints.toString() : 'fetching....'
      }`}
      value={eraHead ? eraHead.index.toString() : 'fetching....'}
    />
  );
};

export default EraHeader;
