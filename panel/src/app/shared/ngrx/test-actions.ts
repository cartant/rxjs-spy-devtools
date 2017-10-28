import { Action } from '@ngrx/store';

export class Foo implements Action {
  static readonly type = 'FOO';
  readonly type = Foo.type;
  constructor(public payload: { foo: number } = { foo: 42 }) {}
}

export class Bar implements Action {
  static readonly type = 'BAR';
  readonly type = Bar.type;
  constructor(public payload: { bar: number } = { bar: 56 }) {}
}

export type Any = Foo | Bar;
