import { FONT_SIZES, FONT_WEIGHTS, MARGIN_SIZES } from './constants';
export * from './stateful/AddressSummary/types';
export declare type FontSize = keyof typeof FONT_SIZES;
export declare type FontWeight = keyof typeof FONT_WEIGHTS;
export declare type MarginSize = keyof typeof MARGIN_SIZES;
export declare type SUIDisplay = 'inline' | 'block';
export declare type SUIPosition = 'bottom' | 'left' | 'right' | 'top';
export declare type FlexAlign = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
export declare type FlexDirection = 'row' | 'column';
export declare type FlexJustify = 'flex-start' | 'flex-end' | 'center' | 'space-around' | 'space-between';
export declare type SizeType = 'tiny' | 'small' | 'medium' | 'large';
/**
 * Size for <Input />
 */
export declare type SUIInputSize = 'mini' | 'small' | 'large' | 'big' | 'huge' | 'massive';
export declare type SUIBreadcrumbSize = SUIInputSize;
export declare type SUISize = 'mini' | 'tiny' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'massive';
export declare type SUIProgressBarSize = 'tiny' | 'small' | 'medium' | 'large' | 'big';
