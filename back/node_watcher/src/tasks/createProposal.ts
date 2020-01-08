// Copyright 2018-2019 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';
import { createType, GenericCall, getTypeDef } from '@polkadot/types';
import { BlockNumber, Hash } from '@polkadot/types/interfaces';
import { Codec, TypeDef } from '@polkadot/types/types';
import { logger } from '@polkadot/util';

// import { prisma } from '../generated/prisma-client';
import { NomidotSlashing, Task } from './types';

const l = logger('Task: Proposals');

interface Param {
  name: string;
  type: TypeDef;
}

interface Value {
  isValid: boolean;
  value: Codec;
}

/*
 *  ======= Table (Slashing) ======
 */
const createProposal: Task<NomidotSlashing[]> = {
  name: 'createProposal',
  read: async (
    blockHash: Hash,
    api: ApiPromise
  ): Promise<NomidotSlashing[]> => {
    // const eventsAtBlock: Vec<EventRecord> = await api.query.system.events.at(
    //   blockHash
    // );

    // Initial scrapping of all proposals. Casting is needed for now
    const publicProps = await api.query.democracy.publicProps.at(blockHash);
    console.log('publicProps unwrap', publicProps.toString());
    // e.g returns
    // [[0,"0x8c50b176392b6e6ac8eeb643541f13beb02178801d2b134bfc4ab804764c09a1","5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"]]

    publicProps.map(async ([idNumber, preImageHash, proposer]) => {
      const proposalId = idNumber.toNumber();
      const depositOf = await api.query.democracy.depositOf(proposalId);
      const preImageRaw = await api.query.democracy.preimages(preImageHash);
      const preImage = preImageRaw.unwrapOr(null);

      const depositInfo = depositOf.unwrapOr(null);
      const depositAmount = depositInfo ? depositInfo[0] : undefined;
      const proposal = preImage
        ? createType(api.registry, 'Proposal', preImage[0].toU8a(true))
        : undefined;

      const { meta, method, section } = proposal
        ? api.registry.findMetaCall(proposal.callIndex)
        : { meta: undefined, method: undefined, section: undefined };

      const params = proposal
        ? GenericCall.filterOrigin(proposal.meta).map(({ name }) =>
            name.toString()
          )
        : undefined;
      const values = proposal ? proposal.args : undefined;
      const hash = proposal ? proposal.hash : undefined;

      l.log('proposer', proposer.toString());
      l.log('proposalId', proposalId);
      l.log('preImage', preImage);
      l.log('depositAmount', depositAmount && depositAmount.toNumber());
      l.log('meta.description', meta?.documentation.toString());
      l.log('method', method);
      l.log('section', section);
      l.log('params', params);
      l.log('values', values);
      l.log('hash', hash);

      // );
      //   const { meta, method, section } = GenericCall.findFunction(
      //     proposal.callIndex
      //   );
      //   const methodName = `${section}.${method}`;
    });

    const result: NomidotSlashing[] = [];

    // slashEvents.map(({ event: { data } }) => {
    //   result.push({
    //     who: createType(api.registry, 'AccountId', data[0].toString()),
    //     amount: createType(api.registry, 'Balance', data[1].toString()),
    //   });
    // });

    l.log(`Nomidot Proposals: ${JSON.stringify(result)}`);

    return result;
  },
  write: async (blockNumber: BlockNumber, value: NomidotSlashing[]) => {
    //   await Promise.all(
    //     value.map(async slashEvent => {
    //       const { who, amount } = slashEvent;
    //       await prisma.createSlashing({
    //         blockNumber: {
    //           connect: {
    //             number: blockNumber.toNumber(),
    //           },  updateProposal(data: ProposalUpdateInput!, where: ProposalWhereUniqueInput!): Proposal
    //         },
    //         who: who.toHex(),
    //         amount: amount.toHex(),
    //       });
    //     })
    //   );
  },
};

// const getPostAndProposalInfo = async (
//   api: ApiPromise,
//   idNumber: number,
//   proposal: Proposal
// ): Promise<PostAndProposalTypeInfo | null> => {
//   const depositOf = await api.query.democracy.depositOf<
//     Option<ITuple<[BalanceOf, Vec<AccountId>]>>
//   >(idNumber);

//   const depositInfo = depositOf.unwrapOr(null);
//   if (!depositInfo) return null;
//   // e.g returns
//   // [
//   //   [0,{"callIndex":"0x0001","args":{"_remark":"0x01"}},"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"],
//   //   [1,{"callIndex":"0x0602","args":{"source":"5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY","dest":"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty","value":123000000000000}},"5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"]
//   // ]
//   const authorAddress = depositInfo[1][0].toString();
//   const depositAmount = depositInfo[0];
//   const { meta, method, section } = GenericCall.findFunction(
//     proposal.callIndex
//   );
//   const methodName = `${section}.${method}`;
//   // console.log('-----------------------------')
//   // console.log('authorAddress',authorAddress)
//   // console.log('amountDeposit',depositAmount)
//   // console.log('methodName',methodName)

//   // const documentation = (meta && meta.documentation) ? meta.documentation.join(' ') : null;

//   const params = GenericCall.filterOrigin(proposal.meta).map(({ name }): {
//     name: string;
//   } => ({
//     name: name.toString(),
//   }));

//   const methodArguments =
//     proposal &&
//     proposal.args &&
//     params &&
//     params.reduce((agg, arg, index) => {
//       return {
//         ...agg,
//         // FIXME prob not super clever to "toString()" the arg here. Addresses or array of addresses should remain as such.
//         [arg.name]: proposal.args[index].toString(),
//       };
//     }, {});

//   return {
//     authorId: 56, // FIXME need to have an actual author id based on the address
//     depositAmount,
//     methodArguments: JSON.stringify(methodArguments),
//     methodName,
//   };
// };

export default createProposal;
