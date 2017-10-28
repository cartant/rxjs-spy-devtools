import { Action } from '@ngrx/store';

export interface ActionConstructor<T extends Action> {
  type: string;
  new (...args: any[]): T;
}
