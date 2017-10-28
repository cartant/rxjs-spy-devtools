import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';
import { ActionConstructor } from './action-constructor';

export function ofType<T1 extends Action>(
    actionConstructor1: ActionConstructor<T1>
): (source: Observable<Action>) => Observable<T1>;

export function ofType<T1 extends Action, T2 extends Action>(
    actionConstructor1: ActionConstructor<T1>,
    actionConstructor2: ActionConstructor<T2>
): (source: Observable<Action>) => Observable<T1 | T2>;

export function ofType<T1 extends Action, T2 extends Action, T3 extends Action>(
    actionConstructor1: ActionConstructor<T1>,
    actionConstructor2: ActionConstructor<T2>,
    actionConstructor3: ActionConstructor<T3>
): (source: Observable<Action>) => Observable<T1 | T2 | T3>;

export function ofType<R extends Action>(
    ...actionConstructors: ActionConstructor<any>[]
): (source: Observable<Action>) => Observable<R> {
    return filter<any>(action => actionConstructors.some(actionConstructor => action.type === actionConstructor.type));
}
