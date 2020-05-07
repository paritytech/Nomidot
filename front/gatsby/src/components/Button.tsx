// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { polkadotOfficialTheme } from '@substrate/ui-components';
import React, { memo } from 'react';
import styled, { css, FlattenSimpleInterpolation } from 'styled-components';

type ButtonSizeProp = 'tiny' | 'small' | 'big' | 'huge';

const ButtonSizeMap = {
  tiny: {
    width: '45px',
    height: '15px',
  },
  small: {
    width: '90px',
    height: '30px',
  },
  big: {
    width: '180px',
    height: '60px',
  },
  huge: {
    width: '260px',
    height: '90px',
  },
};

interface ButtonProps {
  primary?: boolean; // blue
  secondary?: boolean; // pink
  neutral?: boolean; // black
  disabled?: boolean;
  float?: string;
  size?: ButtonSizeProp;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export const Button = memo(styled.a<ButtonProps>`
  background: ${polkadotOfficialTheme.hotPink};
  border-radius: 3px;
  border: 2px solid white;
  color: white;
  display: flex;
  float: ${(props): string => props.float || 'none'};
  padding: 5px 10px;
  text-align: center;
  align-items: center;
  justify-content: center;
  height: ${(props): string => ButtonSizeMap[props.size || 'small'].height};
  width: ${(props): string => ButtonSizeMap[props.size || 'small'].width};

  &:hover {
    cursor: pointer;
    color: white;
  }

  ${(props): FlattenSimpleInterpolation | null =>
    props.disabled
      ? css`
          :disabled {
            background: black;
          }
        `
      : null}

  ${(props): FlattenSimpleInterpolation | null =>
    props.primary
      ? css`
          background: white;
          border: 2px solid ${polkadotOfficialTheme.hotPink};
          color: ${polkadotOfficialTheme.hotPink};

          &:hover {
            cursor: pointer;
            color: ${polkadotOfficialTheme.hotPink};
          }
        `
      : null}

  ${(props): FlattenSimpleInterpolation | null =>
    props.secondary
      ? css`
          background: white;
          border: 2px solid ${polkadotOfficialTheme.neonBlue};
          color: ${polkadotOfficialTheme.neonBlue};

          &:hover {
            cursor: pointer;
            color: ${polkadotOfficialTheme.neonBlue};
          }
        `
      : null}

  ${(props): FlattenSimpleInterpolation | null =>
    props.neutral
      ? css`
          background: white;
          border: 2px solid ${polkadotOfficialTheme.black};
          color: ${polkadotOfficialTheme.black};

          &:hover {
            cursor: pointer;
            color: ${polkadotOfficialTheme.black};
            background: ${polkadotOfficialTheme.white};
          }
        `
      : null}
`);
