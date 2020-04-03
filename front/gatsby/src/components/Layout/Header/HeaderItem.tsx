// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Stacked, WithSpaceAround } from '@substrate/ui-components';
import React from 'react';
import styled from 'styled-components';

interface Props {
  title: string,
  subtitle?: string | React.ReactNode
  value: string
}

const ItemWrapper = styled.div`
  display: flex column;
  justifyContent: flex-start;
  alignItems: flex-start;
  width: 100%;
  padding: 1rem 1rem;
`

const Title = styled.p`
  font-weight: 100;
  font-family: code sans-serif;
`

const Value = styled.h3`
  font-family: code sans-serif;
`

const Subtitle = styled.small`
  font-weight: 600;
  color: #c0c0c0;
  font-family: code sans-serif;
`

const HeaderItem = (props: Props): React.ReactElement => {
  const { title, subtitle, value } = props;

  return (
    <ItemWrapper>
      <Title>{title}</Title>
      <Value>{value}</Value>
      <Subtitle>{subtitle}</Subtitle>
    </ItemWrapper>
  )
}

export default HeaderItem;