import { EventRecord } from '@polkadot/types/interfaces';

export function filterEvents(events: EventRecord[], _section: string, _method: string): EventRecord[]
{
  return events.filter(({ event: { method, section } }) => section === _section && method === _method);
}