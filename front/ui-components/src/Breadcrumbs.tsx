// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIBreadcrumb, {
  BreadcrumbProps,
} from 'semantic-ui-react/dist/commonjs/collections/Breadcrumb/Breadcrumb';

import { substrateLightTheme } from './globalStyle';
import { Circle, FadedText, Margin, Stacked, StackedHorizontal } from './index';
import { SUIBreadcrumbSize } from './types';

interface Props {
  activeLabel: string;
  onClick?: (
    event: React.MouseEvent<HTMLElement>,
    data: BreadcrumbProps
  ) => void;
  sectionLabels: Array<string>;
  size?: SUIBreadcrumbSize;
}

export function Breadcrumbs(props: BreadcrumbProps): React.ReactElement {
  const { activeLabel, onClick, sectionLabels, size } = props;

  return (
    <SUIBreadcrumb size={size}>
      <StackedHorizontal>
        {sectionLabels.map((label: string, idx: string) => {
          const active = activeLabel === label;
          return (
            <Margin key={label} left='big'>
              <SUIBreadcrumb.Section active={active} onClick={onClick}>
                <Stacked>
                  <Circle
                    fill={substrateLightTheme.lightBlue1}
                    label={idx.toString()}
                    radius={32}
                    withShadow={active}
                  />
                  <Margin top />
                  <FadedText>{label}</FadedText>
                </Stacked>
              </SUIBreadcrumb.Section>
            </Margin>
          );
        })}
      </StackedHorizontal>
    </SUIBreadcrumb>
  );
}
