// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { formatBalance } from '@polkadot/util';
import { ExtrinsicDetails, TxQueueContext } from '@substrate/context';
import { Spinner } from '@substrate/design-system';
import { polkadotOfficialTheme } from '@substrate/ui-components';
import React, { useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const StatusNotifier = styled.div`
  animation: 1s ${fadeIn} ease-out;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1rem;
  position: absolute;
  top: 3rem;
  right: 1rem;
  height: 6rem;
  width: 15rem;
  border-radius: 24px;
  color: white;
  z-index: 10000;
`;

const PendingStatusNotifier = styled(StatusNotifier)`
  background: ${polkadotOfficialTheme.lightBlue2};
`;

const ErrorStatusNotifier = styled(StatusNotifier)`
  background: ${polkadotOfficialTheme.hotPink};
`;

const SuccessStatusNotifier = styled(StatusNotifier)`
  background: ${polkadotOfficialTheme.neonBlue};
`;

export const Status = (): React.ReactElement | null => {
  const {
    errorObservable,
    statusObservable,
    successObservable,
    state: { txQueue },
  } = useContext(TxQueueContext);

  const [errorMsg, setError] = useState<string>();
  const [pendingMsg, setPending] = useState<string>();
  const [statusMsg, setStatus] = useState<string>();
  const [successMsg, setSuccess] = useState<string>();

  useEffect(() => {
    const statusSub = statusObservable.subscribe(({ msg }) => {
      setPending(undefined);
      setStatus(msg);
      setTimeout(() => {
        setStatus(undefined);
      }, 5000);
    });

    return (): void => statusSub.unsubscribe();
  }, [statusObservable]);

  useEffect(() => {
    const errorSub = errorObservable.subscribe(({ error }) => {
      setPending(undefined);
      setError(error);
      setTimeout(() => {
        setError(undefined);
      }, 5000);
    });

    return (): void => errorSub.unsubscribe();
  }, [errorObservable]);

  useEffect(() => {
    const successSub = successObservable.subscribe(
      (extrinsicDetails: ExtrinsicDetails) => {
        const message = `Extrinsic ${
          extrinsicDetails.methodCall
        } of amount ${formatBalance(
          extrinsicDetails.amount
        )} was sent succesfully! 🎉`;
        setPending(undefined);
        setSuccess(message);

        setTimeout(() => {
          setSuccess(undefined);
        }, 5000);
      }
    );

    return (): void => successSub.unsubscribe();
  }, [successObservable]);

  useEffect(() => {
    if (txQueue.length && !successMsg && !statusMsg) {
      const msg = `Submitting ${
        txQueue[0].details.methodCall
      } with amount ${formatBalance(txQueue[0].details.amount)}...`;

      setPending(msg);
    }
  }, [statusMsg, successMsg, txQueue]);

  if (errorMsg) {
    return <ErrorStatusNotifier> {errorMsg} </ErrorStatusNotifier>;
  }

  if (pendingMsg) {
    return (
      <PendingStatusNotifier>
        {pendingMsg}
        <Spinner active inline />
      </PendingStatusNotifier>
    );
  }

  if (statusMsg) {
    return (
      <PendingStatusNotifier>
        {statusMsg}
        <Spinner active inline />
      </PendingStatusNotifier>
    );
  }

  if (successMsg) {
    return <SuccessStatusNotifier> {successMsg} </SuccessStatusNotifier>;
  }

  return null;
};
