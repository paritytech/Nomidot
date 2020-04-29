// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from 'styled-components';
import media from 'styled-media-query';

export const Table = styled.table`
  width: 100%;
  display: table;
  margin: 1rem;

  ${media.lessThan('large')`
  /* screen width is less than 1170px (large)*/
    display: inline-block;
    width: 45rem;
    overflow-x: scroll;
  `}

  ${media.lessThan('small')`
  /* screen width is less than 768px (medium) */
    width: 25rem;
  `}
`;

export const Thead = styled.thead`
  padding: 1rem 2rem;
  text-align: left;
`;

export const Th = styled.th`
  padding: 1rem 2rem;
  text-align: left;
`;

export const Tb = styled.tbody`
  white-space: nowrap;
`;

export const Tr = styled.tr`
  display: table-row;
  padding: 2rem;
`;

export const Tc = styled.td`
  display: table-cell;
  padding: 1rem;
`;
