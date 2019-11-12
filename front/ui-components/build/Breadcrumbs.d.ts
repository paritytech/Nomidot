import React from 'react';
import { SUIBreadcrumbSize } from './types';
interface BreadcrumbProps {
    activeLabel: string;
    onClick: (event: React.MouseEvent<HTMLElement>, data: any) => void;
    sectionLabels: Array<string>;
    size?: SUIBreadcrumbSize;
}
export declare function Breadcrumbs(props: BreadcrumbProps): React.ReactElement;
export {};
