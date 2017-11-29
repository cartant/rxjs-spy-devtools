import { errorBase } from '@app/shared/utils';
import { DeckStats, Notification, Snapshot as SnapshotPayload } from '@devtools/interfaces';
import { action, base } from 'ts-action';

export const BroadcastDeckStats = action('[Spy] DECK_STATS', base(class { constructor(public stats: DeckStats) {} }));
export const BroadcastNotification = action('[Spy] NOTIFY', base(class { constructor(public notification: Notification) {} }));
export const Connect = action('[Spy] CONNECT');
export const Disconnect = action('[Spy] DISCONNECT');

export const Snapshot = action('[Spy] SNAPSHOT');
export const SnapshotFulfilled = action('[Spy] SNAPSHOT_FULFILLED', base(class { constructor(public snapshot: SnapshotPayload) {} }));
export const SnapshotRejected = action('[Spy] SNAPSHOT_REJECTED', errorBase(Snapshot));
