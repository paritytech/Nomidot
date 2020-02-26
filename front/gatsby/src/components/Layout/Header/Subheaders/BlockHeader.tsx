// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { useSubscription } from '@apollo/react-hooks';
import { ItemStats } from '@substrate/design-system';
import React, { useEffect, useState } from 'react';

import { toShortAddress } from '../../../../util';
import { BLOCKS_SUBSCRIPTION } from '../../../../util/graphql';
import { BlockHead } from '../types';

const BlockHeader = (): React.ReactElement => {
  const { data } = useSubscription(BLOCKS_SUBSCRIPTION);
  const [blockHead, setBlockHead] = useState<BlockHead>();

  useEffect(() => {
    if (data) {
      const {
        subscribeBlockNumbers: { number, authoredBy, hash, startDateTime },
      } = data;

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
    <ItemStats
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
