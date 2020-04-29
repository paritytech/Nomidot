// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from 'styled-components';

const MAIN_FONT = `Lato, Helvetica Neue, Arial, Helvetica, sans-serif;`;
const SECONDARY_FONT = `Maison Neue, Lato, Helvetica, sans-serif`;

export const SubHeader = styled.p`
  letter-spacing: 0.35em;
  text-transform: uppercase;
  font-weight: 900;
  font-size: 11px;
  font-family: ${MAIN_FONT};
`;

export const Text = styled.p`
  color: black;
`;

export const StatItemTitle = styled.p`
  font-size: 1rem;
  font-family: ${MAIN_FONT}
  font-weight: 200;
  line-height: -1px;
  margin-bottom: 0;
`;

export const StatItemValue = styled.span`
  font-family: ${SECONDARY_FONT};
  font-size: 1.5rem;
  font-weight: 600;
  line-height: -1px;
`;
