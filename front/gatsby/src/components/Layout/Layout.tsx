// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import { ApiRxContext } from '@substrate/context';
import { Loading } from '@substrate/ui-components';
import React, { useContext } from 'react';

import { LoadableHeader } from './Header';

interface Props extends RouteComponentProps {
  children: React.ReactNode;
}

export function Layout(props: Props): React.ReactElement {
  const { children } = props;
  const { isApiReady } = useContext(ApiRxContext);

  return (
    <>
      <LoadableHeader {...props} />
      {
        isApiReady
          ? children
          : <Loading active /> 
        }
    </>
  );
}
