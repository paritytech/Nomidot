// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext, ApiContextType } from '@substrate/context/src';
import React, { useEffect, useState } from 'react';

// global
import Layout from '../components/layout';
import SEO from '../components/seo';
// context
import { ContextGate } from '../ContextGate';
import Onboarding from './onboarding';
// pages
import Profile from './profile';

function IndexPage(): React.ReactElement {
  const [exploringAs, setExploringAs] = useState();

  useEffect(() => {
    setExploringAs(localStorage.getItem('exploringAs'));
  }, []);

  return (
    <ContextGate>
      <ApiContext.Consumer>
        {({
          isReady,
        }: Partial<ApiContextType>): React.ReactElement | boolean | undefined =>
          isReady && (
            <Layout>
              <SEO title='Home' />
              {exploringAs ? <Profile /> : <Onboarding />}
            </Layout>
          )
        }
      </ApiContext.Consumer>
    </ContextGate>
  );
}

export default IndexPage;
