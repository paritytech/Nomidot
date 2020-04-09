// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TxQueueContext, ExtrinsicDetails } from '@substrate/context';
import React, { useContext, useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';

const ErrorStatusNotifier = styled.div`
  height: 3rem;
  width: 5rem;
  background: red;
  color: white;
`

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const SuccessStatusNotifier = styled.div`
  animation: 1s ${fadeIn} ease-out;
  position: absolute;
  top: 3rem;
  right: 1rem;
  height: 6rem;
  width: 15rem;
  border-radius: 24px;
  background: green;
  color: white;
  z-index: 10000;
`

export const Status = () => {
  const { errorObservable, successObservable } = useContext(TxQueueContext);

  const [errorMsg, setError] = useState<string>();
  const [successMsg, setSuccess] = useState<ExtrinsicDetails | string>('hello');

  useEffect(() => {
    const errorSub = errorObservable.subscribe(({ error }) => {
      console.log('status: ', error);
      setError(error)
    })

    return () => errorSub.unsubscribe();
  }, []);

  useEffect(() => {
    const successSub = successObservable.subscribe((extrinsicDetails: ExtrinsicDetails) => {
      console.log('status: ', extrinsicDetails.methodCall);
      setSuccess(extrinsicDetails);
    })

    return () => successSub.unsubscribe();
  }, []);

  return (
    <div>
      {
        errorMsg
          ? <ErrorStatusNotifier />
          : successMsg
            ? <SuccessStatusNotifier />
            : null
      }
    </div>
  )
}