// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Icon } from '@substrate/ui-components';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  closed?: boolean;
  height?: string;
  width?: string;
}

export const Tooltip = styled.div<TooltipProps>`
  background: #f2f4f6;
  border-radius: 3px;
  height: ${(props): string => props.height || '50%'};
  width: ${(props): string => props.width || '100%'};
  display: ${(props): string => (props.closed ? 'none' : 'inline-block')};

  > div, p {
    padding: 5px 18px;
  }
`;

const Close = styled(Icon)`
  padding: 10px;

  &:hover {
    cursor: pointer;
  }
`;

interface ClosableTooltipProps {
  height?: string;
  width?: string;
  children: React.ReactNode;
}

export const ClosableTooltip = (
  props: ClosableTooltipProps
): React.ReactElement => {
  const { children, height, width } = props;
  const [closeTooltip, setCloseTooltip] = useState(false);

  const handleClose = useCallback(() => {
    setCloseTooltip(true);
  }, []);

  return (
    <Tooltip closed={closeTooltip} height={height} width={width}>
      <Close name='close' onClick={handleClose} />
      {children}
    </Tooltip>
  );
};
