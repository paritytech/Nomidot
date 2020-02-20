// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.


import { global } from '@substrate/design-system';
import React from 'react';

import { Layout, Seo } from '../components';

const { GlobalStyle } = global;

class IndexPage extends React.Component {
  render() {
    return (
      <Layout>
        <Seo title='Polkadot/Kusama Staking Portal' />
        <GlobalStyle />
      </Layout>
    );
  }
}

export default IndexPage;
