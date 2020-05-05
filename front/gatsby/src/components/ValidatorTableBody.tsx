// // Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// // This software may be modified and distributed under the terms
// // of the Apache-2.0 license. See the LICENSE file for details.

// import { useQuery } from '@apollo/react-hooks';
// import { ApiRx } from '@polkadot/api';
// import { formatBalance } from '@polkadot/util';
// import { Spinner } from '@substrate/design-system';
// import { FadedText, Icon } from '@substrate/ui-components';
// import React, { useEffect, useState } from 'react';
// import shortid from 'shortid';

// import {
//   AddressSummary,
//   Table,
//   Tb,
//   Tc,
//   Th,
//   Thead,
//   Tr,
// } from '../components';
// import { OfflineValidator, Nomination } from '../types';
// import { addToCart } from '../util';
// import {
//   CURRENT_ELECTED,
//   CURRENT_NOMINATIONS,
//   OFFLINE_VALIDATORS,
// } from '../util/graphql';

// interface JoinNominationsAndOffline extends Nomination {
//   wasOfflineThisSession: boolean;
// }

// interface Props {
//   currentElected: Set<JoinNominationsAndOffline>
// }

// const ValidatorTableBody = (props: Props) => {
//   const { currentElected } = props;

//   for (let [key, value] of currentElected.entries()) {
//     // { stash, controller, preferences, wasOfflineThisSession }) => (
//       <Tr key={shortid.generate()}>
//         <Tc>
//           <FadedText>{JSON.stringify(wasOfflineThisSession)}</FadedText>
//         </Tc>
//         <Tc>
//           <AddressSummary
//             address={stash}
//             api={api}
//             size='small'
//             noBalance
//             noPlaceholderName
//           />
//         </Tc>
//         <Tc>
//           <AddressSummary
//             address={controller}
//             api={api}
//             size='small'
//             noBalance
//             noPlaceholderName
//           />
//         </Tc>
//         <Tc>
//           <FadedText>
//             {formatBalance(
//               api
//                 .createType('ValidatorPrefs', preferences)
//                 .commission.toString()
//             )}
//           </FadedText>
//         </Tc>
//         <Tc>
//           <Icon
//             onClick={handleAddToCart}
//             data-stash={stash}
//             name='add to cart'
//           />
//         </Tc>
//       </Tr>
//     )
//   )
// }