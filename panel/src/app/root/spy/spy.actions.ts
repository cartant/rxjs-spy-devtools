import { Notification } from '@devtools/interfaces';
import { action, payload } from 'ts-action';

export const Connect = action('[Spy] CONNECT');
export const Disconnect = action('[Spy] DISCONNECT');
export const Notify = action('[Spy] NOTIFY', payload<Notification>());
