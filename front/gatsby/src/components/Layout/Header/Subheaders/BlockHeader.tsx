// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useQuery } from '@apollo/react-hooks';
import React, { useEffect, useState } from 'react';

import { toShortAddress } from '../../../../util';
import { LATEST_BLOCK } from '../../../../util/graphql';
import HeaderItem from '../HeaderItem';
import { BlockHead } from '../types';

const BlockHeader = (): React.ReactElement => {
  const { data } = useQuery(LATEST_BLOCK, {
    pollInterval: 5000
  });
  const [blockHead, setBlockHead] = useState<BlockHead>();

  useEffect(() => {
    if (data) {
      const { blockNumbers } = data;
      const block = blockNumbers[0];
      const { number, authoredBy, hash, startDateTime } = block;

      if (!blockHead || number > blockHead.number) {
        setBlockHead({
          authoredBy,
          hash,
          number,
          startDateTime,
        });
      }
    }
  }, [blockHead, data]);

  return (
    <HeaderItem
      title='block #'
      subtitle={`authored by: ${
        blockHead
          ? toShortAddress(blockHead.authoredBy.toString())
          : 'fetching...'
      }`}
      value={blockHead?.number.toString() || 'fetching...'}
    />
  );
};

export default BlockHeader;
