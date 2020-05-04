// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  inverted?: boolean;
  title: string;
  subtitle?: string | React.ReactNode;
  value: string;
}

interface SubtextProps {
  inverted?: boolean;
}

const ItemWrapper = styled.div`
  display: flex column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 2px 2px;
`;

const Title = styled.p<SubtextProps>`
  color: ${props => props.inverted ? 'black' : 'white'};
  font-weight: 100;
  font-family: code sans-serif;
  font-size: 12px;
  line-height: -1px;
  margin: 0;
`;

const Value = styled.p<SubtextProps>`
  font-family: code sans-serif;
  font-size: 16px;
  color: ${props => props.inverted ? 'black' : 'white'};
  line-height: -1px;
  margin: 0;
`;

const Subtitle = styled.p<SubtextProps>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.inverted ? 'black' : 'white'};
  font-family: code sans-serif;
  line-height: -1px;
`;

const HeaderItem = (props: Props): React.ReactElement => {
  const { inverted = false, title, subtitle, value } = props;

  return (
    <ItemWrapper>
      <Title inverted={inverted}>{title}</Title>
      <Value inverted={inverted}>{value}</Value>
      <Subtitle inverted={inverted}>{subtitle}</Subtitle>
    </ItemWrapper>
  );
};

export default HeaderItem;
