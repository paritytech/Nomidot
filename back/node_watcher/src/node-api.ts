// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { AccountId, BlockNumber, Hash } from '@polkadot/types/interfaces';

import { NodeWatcherOptions } from './types';

class NodeApi {
  private api: ApiPromise;
  private options: NodeWatcherOptions;

  constructor(_api: ApiPromise, _options: NodeWatcherOptions) {
    this.api = _api;
    this.options = _options;
  }

  public read = async (blockNumber: number): Promise<any> => {
    const hash = await this.api.query.system.blockHash(blockNumber);

    const blockData = Promise.all([]) // attach the .at(hash) to options.values

    return blockData;
  }
}

export default NodeApi;