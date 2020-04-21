// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { polkadotOfficialTheme } from '@substrate/ui-components';
import styled, { css } from 'styled-components';

type ButtonSizeProp = 'tiny' | 'small' | 'big' | 'huge';

const ButtonSizeMap = {
  tiny: {
    width: '4rem',
    height: '1rem',
  },
  small: {
    width: '22px',
    height: '8px',
  },
  big: {
    width: '9rem',
    height: '3rem',
  },
  huge: {
    width: '11rem',
    height: '4rem',
  },
};

interface ButtonProps {
  primary?: boolean; // blue
  secondary?: boolean; // pink
  neutral?: boolean; // black
  disabled?: boolean;
  size?: ButtonSizeProp;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Button = styled.a<ButtonProps>`
  background: ${polkadotOfficialTheme.hotPink};
  border-radius: 3px;
  border: 2px solid white;
  color: white;
  display: inline-block;
  padding: 5px 10px;
  text-align: center;
  height: ${props => ButtonSizeMap[props.size || 'small'].height} 
  width: ${props => ButtonSizeMap[props.size || 'small'].width};

  &:hover {
    cursor: pointer;
    color: white;
  }

  ${props =>
    props.disabled &&
    css`
      :disabled {
        background: black;
      }
    `}

  ${props =>
    props.primary &&
    css`
      background: white;
      border: 2px solid ${polkadotOfficialTheme.hotPink};
      color: ${polkadotOfficialTheme.hotPink};

      &:hover {
        cursor: pointer;
        color: ${polkadotOfficialTheme.hotPink};
      }
    `}

  ${props =>
    props.secondary &&
    css`
      background: white;
      border: 2px solid ${polkadotOfficialTheme.neonBlue};
      color: ${polkadotOfficialTheme.neonBlue};

      &:hover {
        cursor: pointer;
        color: ${polkadotOfficialTheme.neonBlue};
      }
    `}

  ${props =>
    props.neutral &&
    css`
      background: white;
      border: 2px solid ${polkadotOfficialTheme.black};
      color: ${polkadotOfficialTheme.black};

      &:hover {
        cursor: pointer;
        color: ${polkadotOfficialTheme.black};
        background: ${polkadotOfficialTheme.white};
      }
    `}
`;
