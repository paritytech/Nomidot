// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/submittable';
import {
  AddressOrPair,
  SubmittableExtrinsic,
} from '@polkadot/api/submittable/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { Balance } from '@polkadot/types/interfaces';
import { logger } from '@polkadot/util';
import BN from 'bn.js';
import React, { createContext, useReducer, useState } from 'react';
import { Subject } from 'rxjs';

import { ValueOf } from './types';

const l = logger('tx-queue');

const INIT_ERROR = new Error('TxQueueContext called without Provider.');

type Extrinsic = SubmittableExtrinsic<'rxjs'>;

export interface ExtrinsicDetails {
  allFees: BN;
  allTotal: BN;
  amount: Balance;
  methodCall: string;
  recipientAddress?: string;
  senderPair: AddressOrPair;
}

function isSenderPairKeyring(senderPair: AddressOrPair): boolean | undefined {
  if ((senderPair as KeyringPair).decodePkcs8 !== undefined) {
    return true;
  }
}

/**
 * An item from the TxQueue
 */
export interface PendingExtrinsic {
  details: ExtrinsicDetails;
  extrinsic: Extrinsic;
  id: number;
  status: {
    isAskingForConfirm: boolean; // created for light-ui
    isFinalized: boolean; // comes from node
    isDropped: boolean; // comes from node
    isPending: boolean; // created for light-ui
    isUsurped: boolean; // comes from node
  };
  unsubscribe: () => void;
}

interface State {
  txCounter: number;
  txQueue: PendingExtrinsic[];
}

const INITIAL_STATE: State = {
  txCounter: 0,
  txQueue: [],
};

enum ActionTypes {
  'setTxCounter',
  'setTxQueue',
}

interface Action {
  type: keyof typeof ActionTypes;
  data: ValueOf<State>; // FIXME: this works but is not very precise, which is why we need the ... as `{type}` on all the action.data in stateReducer
}

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setTxCounter':
      return { ...state, txCounter: action.data as number };
    case 'setTxQueue':
      return { ...state, txQueue: action.data as PendingExtrinsic[] };
    default:
      return state;
  }
};

export interface EnqueueParams extends ExtrinsicDetails {
  extrinsic: Extrinsic;
}

interface Props {
  children: React.ReactNode;
}

const cancelObservable = new Subject<{ msg: string }>();
const statusObservable = new Subject<{ msg: string }>();
const successObservable = new Subject<ExtrinsicDetails>();
const errorObservable = new Subject<{ error: string }>();

export const TxQueueContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  enqueue: (extrinsic: Extrinsic, details: ExtrinsicDetails) => {
    console.error(INIT_ERROR);
    return 0 as number; // i have no idea why eslint needs this
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signAndSubmit: (extrinsicId: number) => {
    console.error(INIT_ERROR);
  },
  state: INITIAL_STATE,
  clear: () => {
    console.error(INIT_ERROR);
  },
  cancelObservable,
  statusObservable,
  successObservable,
  errorObservable,
});

export function TxQueueContextProvider(props: Props): React.ReactElement {
  const [state, dispatch] = useReducer(stateReducer, INITIAL_STATE);

  /**
   * Replace tx with id `extrinsicId` with a new tx
   */
  const replaceTx = (extrinsicId: number, newTx: PendingExtrinsic): void => {
    const { txQueue } = state;

    const newTxQueue = txQueue.map((tx: PendingExtrinsic) =>
      tx.id === extrinsicId ? newTx : tx
    );

    dispatch({
      type: 'setTxQueue',
      data: newTxQueue,
    });
  };

  /**
   * Clear the txQueue.
   */
  const clear = (): void => {
    const { txQueue } = state;
    const msg: string[] = [];
    txQueue.forEach(({ extrinsic: { method }, unsubscribe }) => {
      msg.push(`${method.sectionName}.${method.methodName}`);
      unsubscribe();
    });

    dispatch({
      type: 'setTxQueue',
      data: [],
    });

    l.log('Cleared all extrinsics');
    cancelObservable.next({
      msg: `cleared the following extrinsic(s): ${msg.join(' ')}`,
    });
  };

  /**
   * Unsubscribe the tx with id `extrinsicId`
   */
  const closeTxSubscription = (extrinsicId: number): void => {
    const { txQueue } = state;

    const tx = txQueue.find(tx => tx.id === extrinsicId);
    if (tx) {
      tx.unsubscribe();

      dispatch({
        type: 'setTxQueue',
        data: txQueue.filter(tx => tx.id !== extrinsicId),
      });
    }
  };

  /**
   * Add a tx to the queue
   * return tx id
   */
  const enqueue = (extrinsic: Extrinsic, details: ExtrinsicDetails): number => {
    const { txCounter, txQueue } = state;

    const extrinsicId = txCounter;
    dispatch({
      type: 'setTxCounter',
      data: txCounter + 1,
    });

    l.log(
      `Queued extrinsic #${extrinsicId} from ${
        isSenderPairKeyring(details.senderPair)
          ? (details.senderPair as KeyringPair).address
          : (details.senderPair as string)
      } to ${details.recipientAddress} of amount ${details.amount}`,
      details
    );

    dispatch({
      type: 'setTxQueue',
      data: txQueue.concat({
        details,
        extrinsic,
        id: extrinsicId,
        status: {
          isAskingForConfirm: true,
          isFinalized: false,
          isDropped: false,
          isPending: false,
          isUsurped: false,
        },
        unsubscribe: () => {
          /* Do nothing on unsubscribe at this stage */
        },
      }),
    });

    return extrinsicId;
  };

  /**
   * Sign and send the tx with id `extrinsicId`
   */
  const signAndSubmit = (extrinsicId: number): void => {
    const { txQueue } = state;

    const pendingExtrinsic = txQueue.find(tx => tx.id === extrinsicId);

    if (!pendingExtrinsic) {
      l.error(`There's no extrinsic with id #${extrinsicId}`);
      return;
    }

    const { details, extrinsic, status } = pendingExtrinsic;
    const { senderPair } = details;

    if (!status.isAskingForConfirm) {
      l.error(
        `Extrinsic #${extrinsicId} is being submitted, but its status is not isAskingForConfirm`
      );
      return;
    }

    l.log(`Extrinsic #${extrinsicId} is being sent`);

    const subscription = extrinsic
      .signAndSend(senderPair) // send the extrinsic
      .subscribe(
        (txResult: SubmittableResult) => {
          console.log('tx result received => ', txResult);

          const {
            status: { isFinalized, isDropped, isUsurped },
          } = txResult;

          l.log(`Extrinsic #${extrinsicId} has new status:`, txResult);
          statusObservable.next({
            msg: `Extrinsic #${extrinsicId} has new status: ${txResult.status.toHuman()}`,
          });

          replaceTx(extrinsicId, {
            ...pendingExtrinsic,
            status: {
              isAskingForConfirm: false,
              isDropped,
              isFinalized,
              isPending: false,
              isUsurped,
            },
          });

          if (isFinalized) {
            successObservable.next(details);
          }

          if (isFinalized || isDropped || isUsurped) {
            closeTxSubscription(extrinsicId);
          }
        },
        (error: Error) => {
          errorObservable.next({ error: error.message });
        },
        () => {
          // Lock pair, as we don't need it anymore
          // In the future, the locking strategy could be done in ui-keyring:
          // https://github.com/polkadot-js/apps/issues/1102
          if (isSenderPairKeyring(senderPair)) {
            (senderPair as KeyringPair).lock();
          }
        }
      );

    replaceTx(extrinsicId, {
      ...pendingExtrinsic,
      status: {
        ...pendingExtrinsic.status,
        isAskingForConfirm: false,
        isPending: true,
      },
      unsubscribe: () => {
        subscription.unsubscribe();
      },
    });
  };

  return (
    <TxQueueContext.Provider
      value={{
        clear,
        enqueue,
        signAndSubmit,
        state,
        successObservable,
        statusObservable,
        errorObservable,
        cancelObservable,
      }}
    >
      {props.children}
    </TxQueueContext.Provider>
  );
}
