// Copyright 2018-2020 @paritytech/nomidot authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { EventRecord } from '@polkadot/types/interfaces';

export function filterEvents(
  events: EventRecord[],
  _section: string,
  _method: string
): EventRecord[] {
  return events.filter(
    ({ event: { method, section } }) =>
      section === _section && method === _method
  );
}
