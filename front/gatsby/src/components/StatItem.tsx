// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import * as React from 'react';
import styled from 'styled-components';

import { StatItemTitle, StatItemValue } from './index';

const Wrapper = styled.h2`
  display: flex column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 18px;
`;

interface Props {
  title: string;
  children?: React.ReactNode;
  value?: string;
}

const StatItem = (props: Props): React.ReactElement => {
  const { children, title, value } = props;

  return (
    <Wrapper>
      <StatItemTitle>{title}</StatItemTitle>
      <StatItemValue>{value}</StatItemValue>
      {children}
    </Wrapper>
  );
};

export default React.memo(StatItem);
