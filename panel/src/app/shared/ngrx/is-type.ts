import { Action } from '@ngrx/store';
import { ActionConstructor } from './action-constructor';

export function isType<T extends Action>(action: Action, actionConstructor: ActionConstructor<T>): action is T {
  return action.type === actionConstructor.type;
}
