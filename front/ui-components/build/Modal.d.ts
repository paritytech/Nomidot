import React from 'react';
import { ModalProps as SUIModalProps } from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
declare type ModalProps = SUIModalProps;
export declare function Modal(props: ModalProps): React.ReactElement;
export declare namespace Modal {
    var Actions: import("styled-components").StyledComponent<React.StatelessComponent<import("semantic-ui-react").ModalContentProps>, any, {}, never>;
    var Content: import("styled-components").StyledComponent<React.StatelessComponent<import("semantic-ui-react").ModalContentProps>, any, {}, never>;
    var Header: import("styled-components").StyledComponent<"h2", any, import("./StyleProps").HeaderProps, never>;
    var SubHeader: import("styled-components").StyledComponent<"h3", any, import("./StyleProps").SubHeaderProps, never>;
    var FadedText: import("styled-components").StyledComponent<"p", any, {}, never>;
    var Description: React.StatelessComponent<import("semantic-ui-react").ModalDescriptionProps>;
}
export {};
