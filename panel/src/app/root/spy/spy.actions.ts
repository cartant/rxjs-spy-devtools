import { Notification } from '@devtools/interfaces';
import { action, payload } from 'ts-action';

export const Notify = action('NOTIFY', payload<Notification>());
