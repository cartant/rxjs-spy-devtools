import { Notification, Snapshot as SnapshotPayload } from '@devtools/interfaces';
import { action, payload } from 'ts-action';

export const Connect = action('[Spy] CONNECT');
export const Disconnect = action('[Spy] DISCONNECT');
export const Notify = action('[Spy] NOTIFY', payload<Notification>());
export const Snapshot = action('[Spy] SNAPSHOT');
export const SnapshotCancelled = action('[Spy] SNAPSHOT_CANCELLED');
export const SnapshotFulfilled = action('[Spy] SNAPSHOT_FULFILLED', payload<SnapshotPayload>());
export const SnapshotRejected = action('[Spy] SNAPSHOT_REJECTED', payload<string>());
