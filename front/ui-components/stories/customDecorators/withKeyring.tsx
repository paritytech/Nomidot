// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringContextProvider } from '@substrate/context';
import React from 'react';

export const withKeyring = (
  storyFn: () => React.ReactElement
): React.ReactElement => {
  return <KeyringContextProvider>{storyFn()}</KeyringContextProvider>;
};
