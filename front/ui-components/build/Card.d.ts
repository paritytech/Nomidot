import React from 'react';
import { CardProps as SUICardProps } from 'semantic-ui-react/dist/commonjs/views/Card';
declare type CardProps = SUICardProps;
export declare function Card(props: CardProps): React.ReactElement;
export declare namespace Card {
    var Content: React.StatelessComponent<import("semantic-ui-react").CardContentProps>;
    var Description: React.StatelessComponent<import("semantic-ui-react").CardDescriptionProps>;
    var Group: React.StatelessComponent<import("semantic-ui-react").CardGroupProps>;
    var Header: React.StatelessComponent<import("semantic-ui-react").CardHeaderProps>;
}
export {};
