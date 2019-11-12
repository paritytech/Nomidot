import React from 'react';
import { StyledNavLinkProps } from './StyleProps';
import { FontSize } from './types';
interface NavLinkProps extends StyledNavLinkProps {
    children: React.ReactChildren;
    fontSize?: FontSize;
    fontWeight?: string;
    value?: string;
}
export declare function NavLink(props: NavLinkProps): React.ReactElement;
export {};
