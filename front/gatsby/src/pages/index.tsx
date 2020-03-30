// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { navigate } from 'gatsby';
import React, { useEffect } from 'react';

interface Props {
  children: React.ReactNode;
}

const IndexPage = (props: Props): React.ReactElement => {
  const { children } = props;

  useEffect(() => {
    navigate('/accounts');
  }, []);

  return <div>{children}</div>;
};

export default IndexPage;
