// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export const preimageStatus = {
  INVALID: 'PreimageUsed',
  MISSING: 'PreimageMissing',
  NOTED: 'PreimageNoted',
  REAPED: 'PreimageReaped',
  USED: 'PreimageUsed',
};

export const proposalStatus = {
  PROPOSED: 'Proposed',
  TABLED: 'Tabled',
};

export const referendumStatus = {
  CANCELLED: 'Cancelled',
  EXECUTED: 'Executed',
  NOTPASSED: 'NotPassed',
  PASSED: 'Passed',
  STARTED: 'Started',
};

export const motionStatus = {
  EXECUTED: 'Executed',
  APPROVED: 'Approved',
  DISAPPROVED: 'Disapproved',
  PROPOSED: 'Proposed',
  VOTED: 'Voted',
};

export const treasuryProposalStatus = {
  PROPOSED: 'Proposed',
  TABLED: 'Awarded',
  REJECTED: 'Rejected',
};
