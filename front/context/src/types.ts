// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/rpc-provider/types';

export interface ApiRxContextProviderProps {
  children?: React.ReactElement;
  provider: ProviderInterface;
}


/**
 * See: https://stackoverflow.com/questions/49285864/is-there-a-valueof-similar-to-keyof-in-typescript
 **/
export type ValueOf<T> = T[keyof T];
