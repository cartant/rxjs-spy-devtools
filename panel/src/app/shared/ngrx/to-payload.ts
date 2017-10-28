import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { ActionWithPayload } from './action-with-payload';

export function toPayload<T>(): (source: Observable<ActionWithPayload<T>>) => Observable<T> {
  return map(action => action.payload);
}
