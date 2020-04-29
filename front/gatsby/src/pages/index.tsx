// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountsContext } from '@substrate/context';
import { navigate } from 'gatsby';
import React, { useContext, useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const IndexPage = (props: Props): React.ReactElement => {
  const { children } = props;
  const {
    state: { extension },
  } = useContext(AccountsContext);

  useEffect(() => {
    if (!extension) {
      navigate('/install');
    } else {
      navigate('/accounts');
    }
  }, [extension]);

  return <div>{children}</div>;
};

export default IndexPage;
