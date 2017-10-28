import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { tap } from 'rxjs/operators/tap';
import { toArray } from 'rxjs/operators/toArray';
import { isType } from './is-type';
import { ofType } from './of-type';
import { Foo, Bar } from './test-actions';
import { observe } from '../utils/observe';

describe('ofType', () => {

  it('should filter actions matching a single type', observe(() => {
    return of<Action>(new Foo(), new Bar()).pipe(
      ofType(Foo),
      map(action => action.payload.foo),
      toArray(),
      tap(array => expect(array).toEqual([42]))
    );
  }));

  it('should filter actions matching multiple types', observe(() => {
    return of<Action>(new Foo(), new Bar()).pipe(
      ofType(Foo, Bar),
      map(action => isType(action, Foo) ? action.payload.foo : action.payload.bar),
      toArray(),
      tap(array => expect(array).toEqual([42, 56]))
    );
  }));

  it('should filter actions not matching a type', observe(() => {
    return of<Action>(new Foo()).pipe(
      ofType(Bar),
      map(action => action.payload.bar),
      toArray(),
      tap(array => expect(array).toEqual([]))
    );
  }));
});
