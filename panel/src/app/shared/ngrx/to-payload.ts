import { ActionWithPayload } from './action-with-payload';

export function toPayload<T>(action: ActionWithPayload<T>): T {
  return action.payload;
}
