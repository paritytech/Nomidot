// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType } from '@polkadot/types';
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

        const { meta, method, section } = api.registry.findMetaCall(
          proposal.callIndex
        );

        // const params = proposal
        //   ? GenericCall.filterOrigin(proposal.meta).map(({ name }) =>
        //       name.toString()
        //     )
        //   : undefined;
        // const values = proposal ? proposal.args : undefined;
        const hash = proposal.hash;

        const result = {
          depositAmount,
          hash: hash,
          proposal,
          proposalId,
          proposer,
          metaDescription: meta?.documentation.toString(),
          method,
          section,
          // params,
          // values,
        };
        // proposer 5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY
        // proposalId 0
        // preImage [ '0x00010422',
        //   '0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d',
        //   '400000000',
        //   '25' ]
        // depositAmount 33000000000000
        // meta.description [ Make some on-chain remark.]
        // method remark
        // section system
        // params [ '_remark' ]
        // values [ '0x22' ]
        // hash 0xebf981b559c6f544825e8c135d58c6123387b669aa9e672211ead85074c2d66

        // slashEvents.map(({ event: { data } }) => {
        //   result.push({
        //     who: createType(api.registry, 'AccountId', data[0].toString()),
        //     amount: createType(api.registry, 'Balance', data[1].toString()),
        //   });
        // });

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
          proposalId,
          proposer: proposer.toString(),
          metaDescription,
          method,
          section,
        });
      })
    );
  },
};

export default createProposal;
