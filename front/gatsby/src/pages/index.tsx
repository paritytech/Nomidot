// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext, ApiContextType } from '@substrate/context';
import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { ContextGate } from '../ContextGate';
import { Onboarding } from './onboarding';

function IndexPage(): React.ReactElement {
  return (
    <ContextGate>
      <ApiContext.Consumer>
        {({
          isReady,
        }: Partial<ApiContextType>): React.ReactElement | boolean | undefined =>
          isReady && (
            <Layout>
              <SEO title='Home' />
              <Onboarding />
            </Layout>
          )
        }
      </ApiContext.Consumer>
    </ContextGate>
  );
}

export default IndexPage;
