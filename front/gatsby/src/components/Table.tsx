// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from 'styled-components';
import media from 'styled-media-query';

export const Table = styled.table`
  width: 100%;
  display: inline-block;
  margin: 1rem;

  ${media.lessThan('large')`
  /* screen width is less than 1170px (large)*/
    width: 45rem;
    overflow-x: scroll;
  `}

  ${media.lessThan('medium')`
  /* screen width is less than 768px (medium) */
    width: 40rem;
  `}

  ${media.lessThan('small')`
  /* screen width is less than 768px (medium) */
    width: 10rem;
  `}
`;

export const Tc = styled.td`
  padding: 1rem;
`;

export const Thead = styled.thead`
  display: flex column;
  justify-content: space-between;
  align-items: stretch;
  padding: 1rem 2rem;
`;

export const Th = styled.th`
  display: flex column;
  justify-content: space-between;
  align-items: stretch;
  padding: 1rem 2rem;
`;

export const Tb = styled.tbody`
  white-space: nowrap;
  display: flex column;
  justify-content: space-between;
  align-items: stretch;
`;

export const Tr = styled.tr`
  display: flex column;
  justify-content: space-between;
  align-items: stretch;
  padding: 2rem;
`;
