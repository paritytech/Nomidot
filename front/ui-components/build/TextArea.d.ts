import React from 'react';
declare type TextAreaProps = {
    placeholder?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    rows?: number;
    value?: string;
};
export declare function TextArea(props: TextAreaProps): React.ReactElement;
export {};
