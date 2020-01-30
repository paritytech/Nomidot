// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIProgress from 'semantic-ui-react/dist/commonjs/modules/Progress/Progress';

import { SUIColor, SUIProgressBarSize } from './types';

interface ProgressProps {
  color?: SUIColor;
  disabled?: boolean;
  percent?: number;
  size?: SUIProgressBarSize;
  value?: number;
}

export function Progress(props: ProgressProps): React.ReactElement {
  const { color = 'blue', disabled, percent, size } = props;

  return (
    <SUIProgress
      color={color}
      disabled={disabled}
      percent={percent}
      size={size}
    />
  );
}
