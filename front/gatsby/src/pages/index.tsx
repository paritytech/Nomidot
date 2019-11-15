// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext, AccountsContext } from '@substrate/context/src';
import { Router, Redirect } from '@reach/router';
import React, { useContext } from 'react';

import { ContextGate } from '../ContextGate';
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Onboarding } from './onboarding';

function IndexPage() {
  // const { injectedAccounts } = useContext(AccountsContext);

  return (
    <ContextGate>
      <ApiContext.Consumer>
        {({ isReady }) => (
          isReady && (
            <Layout>
              <SEO title="Home" />
              <Router>
                <Onboarding path="/onboarding" />
                <Redirect from="/" to="/onboarding" />
              </Router>
            </Layout>
          )
        )}
      </ApiContext.Consumer>
    </ContextGate>
  )
}

export default IndexPage;