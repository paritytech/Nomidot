/// <reference types="react" />
import { Color } from './globalStyle';
import { FlexAlign, FlexDirection, FlexJustify, FontSize, MarginSize } from './types';
export interface HeaderProps {
    color?: Color;
    margin?: MarginSize;
    noMargin?: boolean;
    textAlign?: string;
}
export interface DynamicSizeTextProps {
    fontWeight?: string;
    fontSize?: FontSize;
}
export interface FlexItemProps {
    flex?: number;
    margin?: MarginSize;
    padding?: MarginSize;
}
export interface StyledNavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    negative?: boolean;
}
export interface StackProps {
    alignItems?: FlexAlign;
    justifyContent?: FlexJustify;
    margin?: string;
    textAlign?: string;
    width?: string;
}
export interface StyledNavLinkProps {
    inverted?: boolean;
}
export interface SubHeaderProps {
    color?: Color;
    margin?: MarginSize;
    noMargin?: boolean;
    textAlign?: string;
}
export interface WithSpaceAroundProps {
    margin?: MarginSize;
    padding?: MarginSize;
}
export interface WithSpaceBetweenProps {
    flexDirection?: FlexDirection;
}
export interface WrapperDivProps {
    margin?: string;
    padding?: string;
    width?: string;
    height?: string;
}
