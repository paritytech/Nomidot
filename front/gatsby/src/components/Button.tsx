// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { polkadotOfficialTheme } from '@substrate/ui-components';
import styled, { css } from 'styled-components';

interface ButtonProps {
  primary?: boolean; // blue
  secondary?: boolean; // pink
  neutral?: boolean; // black
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Button = styled.a<ButtonProps>`
  display: inline-block;
  border-radius: 3px;
  padding: 0.9rem 0.5rem;
  margin: 0.5rem 1rem;
  width: 11rem;
  text-align: center;
  background: ${polkadotOfficialTheme.hotPink};
  color: white;
  border: 2px solid white;

  &:hover {
    cursor: pointer;
    color: white;
  }

  ${props => props.primary && css`
    background: white;
    border: 2px solid ${polkadotOfficialTheme.hotPink};
    color: ${polkadotOfficialTheme.hotPink};

    &:hover {
      cursor: pointer;
      color: ${polkadotOfficialTheme.hotPink};

    }
  `}

  ${props => props.secondary && css`
    background: white;
    border: 2px solid ${polkadotOfficialTheme.neonBlue};
    color: ${polkadotOfficialTheme.neonBlue};

    &:hover {
      cursor: pointer;
      color: ${polkadotOfficialTheme.neonBlue};

    }
  `}

  ${props => props.neutral && css`
    background: white;
    border: 2px solid ${polkadotOfficialTheme.black};
    color: ${polkadotOfficialTheme.black};

    &:hover {
      cursor: pointer;
      color: ${polkadotOfficialTheme.black};
      background: ${polkadotOfficialTheme.white};
    }
  `}
`