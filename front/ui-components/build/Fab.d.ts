import React from 'react';
import { ButtonProps } from 'semantic-ui-react/dist/commonjs/elements/Button';
declare type FabTypes = 'add' | 'send';
interface Props extends ButtonProps {
    type?: FabTypes;
}
export declare function Fab(props: Props): React.ReactElement;
export {};
