// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise, WsProvider } from '@polkadot/api';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';

import { prisma } from './generated/prisma-client';
import { nomidotTasks } from './tasks';
import {
  NomidotBlock,
  NomidotEra,
  NomidotSession,
  NomidotSlashing,
  NomidotTotalIssuance,
  NomidotValidator,
  Task,
} from './tasks/types';

const parityKusama = 'wss://kusama-rpc.polkadot.io/';

// TODO? set up a Docker container to run this from (and purge the db each time)
// Current workaround is to check if record exists, delete and write again if so. Maybe don't need the above todo.

// Just try all the Task I/O's for one or two blocks at each spec version bump.
describe('Nomidot Tasks Spec Version 1020', () => {
  let api: ApiPromise;
  let blockZero: BlockNumber;
  let blockZeroHash: Hash;

  let blockResult: NomidotBlock;
  let eraResult: NomidotEra;
  let sessionResult: NomidotSession;
  let slashingResult: NomidotSlashing[];
  let totalIssuanceResult: NomidotTotalIssuance;
  let validatorResult: NomidotValidator[];

  beforeAll(() => {
    jest.setTimeout(25000);
  });

  beforeAll(
    async (done): Promise<void> => {
      api = await ApiPromise.create({ provider: new WsProvider(parityKusama) });

      blockZero = api.createType('BlockNumber', 0);
      blockZeroHash = await api.rpc.chain.getBlockHash(blockZero);

      const rpcMeta = await api.rpc.state.getMetadata(blockZeroHash);
      api.registry.setMetadata(rpcMeta);

      done();
    }
  );

  it('should get spec version', async done => {
    const runtimeVersion = await api.rpc.state.getRuntimeVersion(blockZeroHash);
    const specVersion = runtimeVersion.specVersion;

    expect(specVersion.toString()).toEqual('1020');

    done();
  });

  describe('Reads', () => {
    it('Task: Block', async done => {
      const blockTask = nomidotTasks[0] as Task<NomidotBlock>;

      blockResult = await blockTask.read(blockZeroHash, api);

      expect(blockResult).toBeDefined();
      expect(blockResult.authoredBy.toString()).toBe(
        'CaKWz5omakTK7ovp4m3koXrHyHb7NG3Nt7GENHbviByZpKp'
      );
      expect(blockResult.hash.toHex()).toBe(
        '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe'
      );
      // block zero had a block time of 0 seconds, so the timestamp here is 0, but is equivalent to that of block 1
      expect(blockResult.startDateTime.toString()).toBe('0');

      done();
    });

    it('Task: Session', async done => {
      const sessionTask = nomidotTasks[1] as Task<NomidotSession>;

      sessionResult = await sessionTask.read(blockZeroHash, api);

      expect(sessionResult).toBeDefined();
      expect(sessionResult.didNewSessionStart).toBe(false);
      expect(sessionResult.idx.toNumber()).toBe(0);

      done();
    });

    it('Task: Era', async done => {
      const eraTask = nomidotTasks[2] as Task<NomidotEra>;

      eraResult = await eraTask.read(blockZeroHash, api);

      expect(eraResult).toBeDefined();
      expect(eraResult.idx.toNumber()).toBe(0);
      expect(eraResult.points.total.toNumber()).toBe(0);
      expect(eraResult.points.individual.length).toBe(0);
      expect(eraResult.startSessionIndex.toNumber()).toBe(0);

      done();
    });

    it('Task: Slashing', async done => {
      const slashingTask = nomidotTasks[3] as Task<NomidotSlashing[]>;

      slashingResult = await slashingTask.read(blockZeroHash, api);

      expect(slashingResult).toBeDefined();
      expect(slashingResult.length).toBe(0);

      done();
    });

    it('Task: TotalIssuance', async done => {
      const totalIssuanceTask = nomidotTasks[4] as Task<NomidotTotalIssuance>;

      totalIssuanceResult = await totalIssuanceTask.read(blockZeroHash, api);

      expect(totalIssuanceResult).toBeDefined();
      expect(totalIssuanceResult.amount.toHex()).toBe(
        '0x00000000000000002fa3ac910e80b000'
      );
      const bal = api.createType(
        'Balance',
        '0x00000000000000002fa3ac910e80b000'
      );
      expect(totalIssuanceResult.amount.toBn()).toEqual(bal.toBn());
      // 3432777080000000000
      done();
    });

    it('Task: Validator', async done => {
      const validatorTask = nomidotTasks[5] as Task<NomidotValidator[]>;

      validatorResult = await validatorTask.read(blockZeroHash, api);

      expect(validatorResult).toBeDefined();
      expect(validatorResult.length).toBe(6);
      validatorResult.map((validator, i) => {
        expect(validator.stash).toBe(validatorResult[i].stash);
        expect(validator.controller).toBe(validatorResult[i].controller);
        expect(validator.validatorPreferences).toBe(validatorResult[i].validatorPreferences);
      });

      done();
    });
  });

  /*
   *  ================================================================================================================================================================================================================================================
   */

  describe('Writes', () => {
    it('Task: Block', async done => {
      const blockTask = nomidotTasks[0] as Task<NomidotBlock>;

      const itAlreadyExists = await prisma.$exists.blockNumber({
        hash: blockResult.hash.toHex(),
      });

      if (itAlreadyExists) {
        await prisma.deleteBlockNumber({
          hash: blockResult.hash.toHex(),
        });
      }

      await blockTask.write(blockZero, blockResult);

      const result = await prisma.blockNumber({
        number: blockZero.toNumber(),
      });

      console.log(`Prisma Block Number: ${JSON.stringify(result)}`);

      expect(result).toBeDefined();
      expect(result!.authoredBy.toString()).toBe(
        blockResult.authoredBy.toString()
      );
      expect(result!.hash).toBe(blockResult.hash.toHex());
      // block zero had a block time of 0 seconds, so the timestamp here is 0, but is equivalent to that of block 1. It will get updated on block 1 task.
      expect(result!.startDateTime).toBe(new Date(0).toISOString());

      done();
    });

    it('Task: Session', async done => {
      // first session is at block 1.
      const sessionTask = nomidotTasks[1] as Task<NomidotSession>;

      const itAlreadyExists = await prisma.$exists.session({
        index: sessionResult.idx.toNumber(),
      });

      if (itAlreadyExists) {
        await prisma.deleteSession({
          index: sessionResult.idx.toNumber(),
        });
      }

      await sessionTask.write(blockZero, sessionResult);

      const result = await prisma.session({
        index: sessionResult.idx.toNumber(),
      });

      console.log(`Prisma Session: ${JSON.stringify(result)}`);

      expect(result).toBeDefined();

      done();
    });

    it('Task: Era', async done => {
      const eraTask = nomidotTasks[2] as Task<NomidotEra>;

      const itAlreadyExists = await prisma.$exists.era({
        index: eraResult.idx.toNumber(),
      });

      if (itAlreadyExists) {
        await prisma.deleteEra({
          index: eraResult.idx.toNumber(),
        });
      }

      await eraTask.write(blockZero, eraResult);

      const result = await prisma.era({
        index: eraResult.idx.toNumber(),
      });

      console.log(`Prisma Era: ${JSON.stringify(result)}`);

      expect(result).toBeNull();

      done();
    });

    it('Task: Slashing', async done => {
      const slashingTask = nomidotTasks[3] as Task<NomidotSlashing[]>;

      await slashingTask.write(blockZero, slashingResult);

      const result = await prisma.slashings({
        where: {
          blockNumber: {
            number: blockZero.toNumber(),
          },
        },
      });

      console.log(`Prisma Slashing: ${JSON.stringify(result)}`);

      expect(result).toEqual([]);

      done();
    });

    it('Task: TotalIssuance', async done => {
      const totalIssuanceTask = nomidotTasks[4] as Task<NomidotTotalIssuance>;

      await totalIssuanceTask.write(blockZero, totalIssuanceResult);

      const result = await prisma.totalIssuances({
        where: {
          blockNumber: {
            number: blockZero.toNumber(),
          },
        },
      });

      console.log(`Prisma TotalIssuance: ${JSON.stringify(result)}`);

      expect(result).toBeDefined();
      result.map(entry => {
        expect(entry.amount.toString()).toBe(
          '0x00000000000000002fa3ac910e80b000'
        );
      });

      done();
    });

    it('Task: Validators', async done => {
      const validatorsTask = nomidotTasks[5] as Task<NomidotValidator[]>;

      await validatorsTask.write(blockZero, validatorResult);

      const result = await prisma.validators({
        where: {
          blockNumber: {
            number: blockZero.toNumber(),
          },
        },
      });

      expect(result).toBeDefined();

      result.map(entry => {
        expect(entry.controller).toBeDefined();
        expect(entry.stash).toBeDefined();
        expect(entry.preferences).toBeDefined();
      });

      done();
    });
  });
});
