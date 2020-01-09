// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContextProvider } from '@substrate/context';
import React from 'react';

import { Loading } from '../../src/index';

export const withApi = (
  storyFn: () => React.ReactElement
): React.ReactElement => {
  return (
    <ApiContextProvider
      loading={<Loading active>Connecting to the node...</Loading>}
    >
      {storyFn()}
    </ApiContextProvider>
  );
};
