export class Foo {
  static readonly type = '[foobar] FOO';
  readonly type = Foo.type;
  constructor(public payload: { foo: number } = { foo: 42 }) {}
}

export class Bar {
  static readonly type = '[foobar] BAR';
  readonly type = Bar.type;
  constructor(public payload: { bar: number } = { bar: 56 }) {}
}

export type Any = Foo | Bar;
