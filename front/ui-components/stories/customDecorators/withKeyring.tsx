// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { KeyringContext, KeyringContextProvider } from '@substrate/context';

export const withKeyring = (
  storyFn: () => React.ReactElement
): React.ReactElement => {
  return (
    <KeyringContextProvider>
      <KeyringContext.Consumer>
        {({ defaultAccount }: any): React.ReactElement | boolean | undefined => storyFn()}
      </KeyringContext.Consumer>
    </KeyringContextProvider>
  );
};