import { Action } from '@ngrx/store';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import { toArray } from 'rxjs/operators/toArray';
import { isType } from './is-type';
import { ofType } from './of-type';
import { Foo, Bar } from './test-actions';

describe('ofType', () => {

  it('should filter actions matching a single type', (done: any) => {
    const source = of<Action>(new Foo(), new Bar());
    const filtered = source
      .pipe(
        ofType(Foo),
        map(action => action.payload.foo),
        toArray()
      )
      .toPromise()
      .then(array => expect(array).toEqual([42]))
      .then(done)
      .catch(done.fail);
  });

  it('should filter actions matching multiple types', (done: any) => {
    const source = of<Action>(new Foo(), new Bar());
    const filtered = source
      .pipe(
        ofType(Foo, Bar),
        map(action => isType(action, Foo) ? action.payload.foo : action.payload.bar),
        toArray()
      )
      .toPromise()
      .then(array => expect(array).toEqual([42, 56]))
      .then(done)
      .catch(done.fail);
  });

  it('should filter actions not matching a type', (done: any) => {
    const source = of<Action>(new Foo());
    const filtered = source
      .pipe(
        ofType(Bar),
        map(action => action.payload.bar),
        toArray()
      )
      .toPromise()
      .then(array => expect(array).toEqual([]))
      .then(done)
      .catch(done.fail);
  });
});
