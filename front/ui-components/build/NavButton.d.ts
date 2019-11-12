import React from 'react';
import { StyledNavButtonProps } from './StyleProps';
import { FontSize } from './types';
interface NavButtonProps extends StyledNavButtonProps {
    fontSize?: FontSize;
    fontWeight?: string;
    value?: string;
}
export declare function NavButton(props: NavButtonProps): React.ReactElement;
export {};
