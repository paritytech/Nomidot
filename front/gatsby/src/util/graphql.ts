// Copyright 2018-2020 @paritytech/Nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import gql from 'graphql-tag';

// ******* QUERIES *******

export const LATEST_BLOCK = gql`
  query {
    blockNumbers(last: 1) {
      authoredBy
      number
      startDateTime
    }
  }
`;

export const LATEST_ERA_QUERY = gql`
  query {
    eras(last: 1) {
      index
      totalPoints
      individualPoints
    }
  }
`;

export const LATEST_SESSION_QUERY = gql`
  query {
    sessions(last: 1) {
      index
    }
  }
`;

export const LATEST_STAKE = gql`
  query {
    stakes(last: 1) {
      blockNumber {
        number
      }
      totalStake
    }
  }
`;

/**
 * Join the two queries below to get a result like following:
 *
 * table1 {
 *  validatorController,
 *  validatorStash,
 *  nominatorStash,
 *  nominatorController,
 *  preferences
 *  stakedAmount
 * }
 *
 * count {
 * }
 */

export const CURRENT_VALIDATORS = gql`
  query Validators($sessionIndex: Int!) {
    validators(where: { session: { index: $sessionIndex } }, last: 220) {
      controller
      stash
      preferences
    }
  }
`;

export const CURRENT_NOMINATIONS = gql`
  query Nominations($sessionIndex: Int!) {
    nominations(where: { session: { index: $sessionIndex } }) {
      validatorController
      validatorStash
      nominatorStash
      nominatorController
      stakedAmount
    }
  }
`;

export const OFFLINE_VALIDATORS = gql`
  query OfflineValidators($sessionIndex: Int!) {
    offlineValidators(where: { sessionIndex: { index: $sessionIndex } }) {
      validatorId
      # total
      # own
      # others
    }
  }
`;

// ******* SUBSCRIPTIONS *******

export const BLOCKS_SUBSCRIPTION = gql`
  subscription {
    blockNumber {
      authoredBy
      hash
      number
      startDateTime
    }
  }
`;

export const ERAS_SUBSCRIPTION = gql`
  subscription {
    era {
      index
      individualPoints
      totalPoints
    }
  }
`;

export const SESSIONS_SUBSCRIPTION = gql`
  subscription {
    session {
      index
    }
  }
`;

export const STAKING_SUBSCRIPTION = gql`
  subscription {
    stake {
      blockNumber {
        number
      }
      totalStake
    }
  }
`;
