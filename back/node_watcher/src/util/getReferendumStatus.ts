import { Option } from '@polkadot/types';
import {
  ReferendumInfo,
  ReferendumInfoTo239,
  ReferendumStatus,
} from '@polkadot/types/interfaces';

function isOld(
  info: ReferendumInfo | ReferendumInfoTo239
): info is ReferendumInfoTo239 {
  return !!(info as ReferendumInfoTo239).proposalHash;
}

export function getReferendumStatus(
  info: Option<ReferendumInfo | ReferendumInfoTo239>
): ReferendumStatus | ReferendumInfoTo239 | null {
  if (info.isNone) {
    return null;
  }

  const unwrapped = info.unwrap();

  if (isOld(unwrapped)) {
    return unwrapped;
  } else if (unwrapped.isOngoing) {
    return unwrapped.asOngoing;
  }

  // done, we don't include it here... only currently active
  return null;
}
