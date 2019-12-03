// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';

import { nomidotTasks } from './tasks';
import { NomidotBlock, Task } from './tasks/types';
import { prisma } from './generated/prisma-client';

const parityKusama = 'wss://kusama-rpc.polkadot.io/';

// Just try all the Task I/O's for one or two blocks at each spec version bump.
describe('Nomidot Tasks', () => {
  let api: ApiPromise;

  beforeEach(
    async (done): Promise<void> => {
      api = await ApiPromise.create({ provider: new WsProvider(parityKusama) });

      done();
    }
  );

  describe('Metadata V6', () => {
    let blockTen: BlockNumber;
    let blockTenHash: Hash;
    let blockResult: NomidotBlock;

    beforeEach(async () => {
      blockTen = api.createType('BlockNumber', 10);
      blockTenHash = await api.rpc.chain.getBlockHash(blockTen);

      console.log(`hash: ${blockTenHash.toString()}`);
    })

    it('should get spec version', async done => {
      const runtimeVersion = await api.rpc.state.getRuntimeVersion(blockTenHash);
      const specVersion = runtimeVersion.specVersion;

      expect(specVersion.toString()).toEqual('1020');
  
      done();
    })
  
    it('should read a block from spec v1020', async done => {
      const blockTask = <Task<NomidotBlock>>nomidotTasks[0];

      blockResult = await blockTask.read(blockTenHash, api);

      expect(blockResult).toBeDefined();
      expect(blockResult.authoredBy.toString()).toBe('CaKWz5omakTK7ovp4m3koXrHyHb7NG3Nt7GENHbviByZpKp');
      expect(blockResult.hash.toHex()).toBe('0x1011c6643b146259206cd0a22bc00f73143d34f3301875a92bdd96a7e362337f');
      expect(blockResult.startDateTime.toString()).toBe('1574962164000');
  
      done();
    })
  
    it('should write a block from spec v1020', async done => {
      await prisma.createBlockNumber({
        number: blockTen.toNumber(),
        authoredBy: blockResult.authoredBy.toHex(),
        startDateTime: new Date(blockResult.startDateTime.toNumber() / 1000).toISOString()
      })
    });
  })

  describe('MetadataV7', () => {

  })

  describe('MetadataV8', () => {
    
  })

  describe('MetadataV9', () => {
    
  })
});
