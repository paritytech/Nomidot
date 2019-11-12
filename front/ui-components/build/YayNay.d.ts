import React from 'react';
interface YayNayProps {
    yay: number;
    nay: number;
    height?: number;
    width?: number;
}
export declare const YayNay: (props: YayNayProps) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
export {};
