// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RouteComponentProps } from '@reach/router';
import React, { useState } from 'react';
import { Segment, Sidebar } from 'semantic-ui-react';

import { LoadableHeader } from './Header';
import { VerticalSidebar } from './Sidebar';

interface Props extends RouteComponentProps {
  children: React.ReactNode;
}

export function Layout(props: Props): React.ReactElement {
  const { children } = props;
  const [visible, setVisible] = useState(false);

  const toggleSidebar = (): void => {
    setVisible(!visible);
  };

  return (
    <Sidebar.Pushable as={Segment} style={{ minHeight: '100vh' }}>
      <VerticalSidebar handleToggle={toggleSidebar} visible={visible} />
      <Sidebar.Pusher>
        <LoadableHeader handleToggle={toggleSidebar} {...props} />
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}
