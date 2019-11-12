import React from 'react';
import { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown';
declare type AddressType = 'accounts' | 'addresses';
export interface InputAddressProps extends DropdownProps {
    onChangeAddress?: (address: string) => any;
    types?: AddressType[];
    value: string;
}
export declare function InputAddress(props: InputAddressProps): React.ReactElement;
export {};
