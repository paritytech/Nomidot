// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppContext, ContextGate } from '@substrate/context/src';
import React, { useEffect, useState } from 'react';

import Layout from "../components/layout"
import SEO from "../components/seo"
import { Onboarding } from './onboarding';

function IndexPage() {
  return (
    <ContextGate>
      <AppContext.Consumer>
        {({ isReady }) => (
          isReady
            ? (
              <Layout>
                <SEO title="Home" />
                <Onboarding />
              </Layout>
            ) : (
              'no ready'
            )
        )}
      </AppContext.Consumer>
    </ContextGate>
  )
}

export default IndexPage;