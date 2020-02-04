// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { APP_TITLE } from '../util';

interface Props {
  children: React.ReactNode;
}

export function Layout({ children }: Props): React.ReactElement {
  return (
    <div>
      {children}
      <footer>
        {APP_TITLE}© {new Date().getFullYear()}.
      </footer>
    </div>
  );
}
