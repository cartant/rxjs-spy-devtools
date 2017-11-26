import { base, Ctor } from 'ts-action';

export function errorBase<T>(actionCtor: Ctor<T>) {
  return base(class { constructor(public error: string, public request: T) {} });
}
