// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext, ContextGate } from '@substrate/context/src';
import React from 'react';

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Onboarding } from './onboarding';

function IndexPage() {
  return (
    <ContextGate>
      <AppContext.Consumer>
        {({ isReady, isWeb3Injected }) => (
          isReady && isWeb3Injected && (
            <Layout>
              <SEO title="Home" />
              <Onboarding />
            </Layout>
          )
        )}
      </AppContext.Consumer>
    </ContextGate>
  )
}

export default IndexPage;