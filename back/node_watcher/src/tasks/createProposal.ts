// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, GenericCall } from '@polkadot/types';
import {
  AccountId,
  BlockNumber,
  Hash,
  PropIndex,
} from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';

import { prisma } from '../generated/prisma-client';
import { NomidotProposal, Task } from './types';

const l = logger('Task: Proposals');

/*
 *  ======= Table (Proposal) ======
 */
const createProposal: Task<NomidotProposal[]> = {
  name: 'createProposal',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotProposal[]> => {
    // const eventsAtBlock: Vec<EventRecord> = await api.query.system.events.at(
    //   blockHash
    // );

    // Initial scrapping of all proposals.
    const publicProps = await api.query.democracy.publicProps.at(blockHash);
    // returns
    // [[0,"0x8c50b176392b6e6ac8eeb643541f13beb02178801d2b134bfc4ab804764c09a1","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"]]

    const results: NomidotProposal[] = [];

    publicProps.map(
      async ([idNumber, preImageHash, proposer]: [
        PropIndex,
        Hash,
        AccountId
      ]) => {
        const proposalId = idNumber.toNumber();
        const depositOf = await api.query.democracy.depositOf(proposalId);
        const preImageRaw = await api.query.democracy.preimages(preImageHash);
        const preImage = preImageRaw.unwrapOr(null);

        if (!preImage) return null;

        const depositInfo = depositOf.unwrapOr(null);
        const depositAmount = depositInfo ? depositInfo[0] : undefined;

        if (!depositAmount) return null;

        const proposal = createType(
          api.registry,
          'Proposal',
          preImage[0].toU8a(true)
        );

        if (!proposal) return null;

        const { meta, method, section } = api.registry.findMetaCall(
          proposal.callIndex
        );

        const params = GenericCall.filterOrigin(proposal.meta).map(({ name }) =>
          name.toString()
        );
        const values = proposal.args;

        const proposalArguments =
          proposal.args &&
          params &&
          params.map((name, index) => {
            return { name, value: values[index].toString() };
          });

        const hash = proposal.hash;

        const result = {
          depositAmount,
          hash: hash,
          proposal,
          proposalArguments,
          proposalId,
          proposer,
          metaDescription: meta?.documentation.toString(),
          method,
          section,
        };

        // {
        //   "depositAmount":11000000000000,
        //   "hash":"0x31dbb7fec5d9f946354a2e9bae6581ab28f0448fc933c1bf3738d3011053d8cb",
        //   "proposal":{"callIndex":"0x0001","args":{"_remark":"0x3333"}},
        //   "proposalArguments":[{"name":"_remark","value":"0x3333"}],
        //   "proposalId":0,
        //   "proposer":"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        //   "metaDescription":"[ Make some on-chain remark.]",
        //   "method":"remark",
        //   "section":"system"
        // }

        l.log(`Nomidot Proposals: ${JSON.stringify(result)}`);

        results.push(result);
      }
    );

    return results;
  },
  write: async (blockNumber: BlockNumber, value: NomidotProposal[]) => {
    await Promise.all(
      value.map(async prop => {
        const {
          depositAmount,
          hash,
          proposal,
          proposalArguments: pA,
          proposalId,
          proposer,
          metaDescription,
          method,
          section,
        } = prop;
        await prisma.createProposal({
          blockNumber: {
            connect: {
              number: blockNumber.toNumber(),
            },
          },
          depositAmount: depositAmount.toString(),
          hash: hash.toHex(),
          proposal: proposal.toHex(),
          proposalArguments: {
            create: pA,
          },
          proposalId,
          proposer: proposer.toString(),
          metaDescription,
          method,
          section,
        });
        // proposalArguments.map(
        //   async ({ name, value }: NomidotProposalArgument) => {
        //     await prisma.createProposalArgument({
        //       name,
        //       proposal: {
        //         connect: {
        //           id: currentProposal.id,
        //         },
        //       },
        //       value,
        //     });
        //   }
        // );
      })
    );
  },
};

export default createProposal;
