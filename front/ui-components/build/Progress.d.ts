import React from 'react';
import { SUIProgressBarSize } from './types';
interface ProgressProps {
    color?: any;
    disabled?: boolean;
    percent?: number;
    size?: SUIProgressBarSize;
    value?: number;
}
export declare function Progress(props: ProgressProps): React.ReactElement;
export {};
