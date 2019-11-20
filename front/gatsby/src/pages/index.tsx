// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext, ApiContextType } from '@substrate/context/src';
import { Loading } from '@substrate/ui-components/src';
import { navigate } from 'gatsby';
import React, { useEffect, useState } from 'react';

// global
import Layout from '../components/layout';
import SEO from '../components/seo';

// context
import { ContextGate } from '../ContextGate';

function IndexPage(): React.ReactElement {
  const [isOnboarded, setIsOnboarded] = useState();
  
  useEffect(() => {
    setIsOnboarded(localStorage.getItem('isOnboarded'));
  }, []);

  return (
    <ContextGate>
      <ApiContext.Consumer>
        {({
          isReady,
        }: Partial<ApiContextType>): React.ReactElement | boolean | undefined =>
          isReady ? (
            <Layout>
              <SEO title='Home' />
              {
                isOnboarded
                  ? navigate('/profile')
                  : navigate('/onboarding')
              }
            </Layout>
          ) : (
            <Loading active inline />
          )
        }
      </ApiContext.Consumer>
    </ContextGate>
  );
}

export default IndexPage;
