// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  title: string;
  subtitle?: string | React.ReactNode;
  value: string;
}

const ItemWrapper = styled.div`
  display: flex column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 2px 2px;
`;

const Title = styled.p`
  color: white;
  font-weight: 100;
  font-family: code sans-serif;
  font-size: 12px;
  line-height: -1px;
  margin: 0;
`;

const Value = styled.p`
  font-family: code sans-serif;
  font-size: 16px;
  color: white;
  line-height: -1px;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: white;
  font-family: code sans-serif;
  line-height: -1px;
`;

const HeaderItem = (props: Props): React.ReactElement => {
  const { title, subtitle, value } = props;

  return (
    <ItemWrapper>
      <Title>{title}</Title>
      <Value>{value}</Value>
      <Subtitle>{subtitle}</Subtitle>
    </ItemWrapper>
  );
};

export default HeaderItem;
