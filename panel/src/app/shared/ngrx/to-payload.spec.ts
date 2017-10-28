import { Action } from '@ngrx/store';
import { ActionWithPayload } from './action-with-payload';
import { of } from 'rxjs/observable/of';
import { tap } from 'rxjs/operators/tap';
import { toArray } from 'rxjs/operators/toArray';
import { Foo, Bar } from './foobar';
import { ofType } from './of-type';
import { toPayload } from './to-payload';
import { observe } from '../utils/observe';

describe('toPayload', () => {

  it('should obtain the payload', observe(() => {
    return of<Action>(new Foo()).pipe(
      ofType(Foo),
      toPayload(),
      toArray(),
      tap(array => expect(array).toEqual([{ foo: 42 }]))
    );
  }));
});
