// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiContext } from '@substrate/context/src';
import React from 'react';

import { ContextGate } from '../ContextGate';
import Layout from '../components/layout';
import SEO from '../components/seo';
import { Onboarding } from './onboarding';

function IndexPage(): React.ReactElement {
	// const { injectedAccounts } = useContext(AccountsContext);

	return (
		<ContextGate>
			<ApiContext.Consumer>
				{({ isReady }) =>
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
