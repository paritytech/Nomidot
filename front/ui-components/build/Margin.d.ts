import { SUISize } from './types';
declare type MarginPropsValue = SUISize | boolean | undefined;
interface MarginProps {
    bottom?: MarginPropsValue;
    left?: MarginPropsValue;
    right?: MarginPropsValue;
    top?: MarginPropsValue;
}
export declare const Margin: import("styled-components").StyledComponent<"div", any, MarginProps, never>;
export {};
