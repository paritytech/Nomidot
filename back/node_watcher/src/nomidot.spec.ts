// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';

import { nomidotTasks } from './tasks';
import { NomidotBlock, NomidotEra, NomidotSession, NomidotSlashing, NomidotTotalIssuance, NomidotValidator, Task } from './tasks/types';
import { prisma } from './generated/prisma-client';

const parityKusama = 'wss://kusama-rpc.polkadot.io/';

// TODO set up a Docker container to run this from (and purge the db each time)

// Just try all the Task I/O's for one or two blocks at each spec version bump.
describe('Nomidot Tasks', () => {
  let api: ApiPromise;

  beforeAll(() => {
    jest.setTimeout(25000);
  })

  beforeAll(
    async (done): Promise<void> => {
      api = await ApiPromise.create({ provider: new WsProvider(parityKusama) });

      done();
    }
  );

  describe('Metadata V6 >>> spec version 1020', () => {
    let blockTen: BlockNumber;
    let blockTenHash: Hash;
    
    let blockResult: NomidotBlock;
    let eraResult: NomidotEra;
    let sessionResult: NomidotSession;
    let slashingResult: NomidotSlashing[];
    let totalIssuanceResult: NomidotTotalIssuance;
    let validatorResult: NomidotValidator[];

    beforeAll(async () => {
      blockTen = api.createType('BlockNumber', 10);
      blockTenHash = await api.rpc.chain.getBlockHash(blockTen);

      const rpcMeta = await api.rpc.state.getMetadata(blockTenHash);
      api.registry.setMetadata(rpcMeta);
    })

    it('should get spec version', async done => {
      const runtimeVersion = await api.rpc.state.getRuntimeVersion(blockTenHash);
      const specVersion = runtimeVersion.specVersion;

      expect(specVersion.toString()).toEqual('1020');
  
      done();
    })

    describe.only('Reads', () => {
      it('Task: Block', async done => {
        const blockTask = <Task<NomidotBlock>>nomidotTasks[0];
  
        blockResult = await blockTask.read(blockTenHash, api);
  
        expect(blockResult).toBeDefined();
        expect(blockResult.authoredBy.toString()).toBe('CaKWz5omakTK7ovp4m3koXrHyHb7NG3Nt7GENHbviByZpKp');
        expect(blockResult.hash.toHex()).toBe('0x1011c6643b146259206cd0a22bc00f73143d34f3301875a92bdd96a7e362337f');
        expect(blockResult.startDateTime.toString()).toBe('1574962164000');
    
        done();
      })

      it('Task: Session', async done => {
        const sessionTask = <Task<NomidotSession>>nomidotTasks[1];

        sessionResult = await sessionTask.read(blockTenHash, api);

        expect(sessionResult).toBeDefined();
        expect(sessionResult.didNewSessionStart).toBe(false);
        expect(sessionResult.idx.toNumber()).toBe(0);

        done();
      })

      it('Task: Era', async done => {
        const eraTask = <Task<NomidotEra>>nomidotTasks[2];

        eraResult = await eraTask.read(blockTenHash, api);

        expect(eraResult).toBeDefined();
        expect(eraResult.idx.toNumber()).toBe(0);
        expect(eraResult.points.total.toNumber()).toBe(0);
        expect(eraResult.points.individual.length).toBe(0);
        expect(eraResult.startSessionIndex.toNumber()).toBe(0);

        done();
      })

      it('Task: Slashing', async done => {
        const slashingTask = <Task<NomidotSlashing[]>>nomidotTasks[3];

        slashingResult = await slashingTask.read(blockTenHash, api);

        expect(slashingResult).toBeDefined();
        expect(slashingResult.length).toBe(0);

        done();
      })

      it('Task: TotalIssuance', async done => {
        const totalIssuanceTask = <Task<NomidotTotalIssuance>>nomidotTasks[4];

        totalIssuanceResult = await totalIssuanceTask.read(blockTenHash, api);

        expect(totalIssuanceResult).toBeDefined();
        expect(totalIssuanceResult.amount.toHex()).toBe('0x00000000000000002fa3ac910e80b000');
        const bal = api.createType('Balance', '0x00000000000000002fa3ac910e80b000');
        expect(totalIssuanceResult.amount.toBn()).toEqual(bal.toBn());
        // 3432777080000000000
        done();
      });

      it.only('Task: Validator', async done => {
        const validatorTask = <Task<NomidotValidator[]>>nomidotTasks[5];

        validatorResult = await validatorTask.read(blockTenHash, api);

        expect(validatorResult).toBeDefined();

        done();
      })
    })
  
    describe('Writes', () => {
      it('should write a block from spec v1020', async done => {
        await prisma.createBlockNumber({
          number: blockTen.toNumber(),
          authoredBy: blockResult.authoredBy.toString(),
          hash: blockResult.hash.toHex(),
          startDateTime: new Date(blockResult.startDateTime.toNumber() / 1000).toISOString()
        })
  
        const result = await prisma.blockNumber({
          number: blockTen.toNumber()
        });
  
        expect(result).toBeDefined();
        expect(result!.number).toBe(10);
        expect(result!.hash).toBe(blockResult.hash.toHex());
  
        done();
      });
    })
  })

  describe('MetadataV7', () => {

  })

  describe('MetadataV8', () => {
    
  })

  describe('MetadataV9', () => {
    
  })
});
