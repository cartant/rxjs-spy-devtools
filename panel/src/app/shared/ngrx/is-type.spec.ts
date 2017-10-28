import { isType } from './is-type';
import { Foo, Bar } from './test-actions';

describe('isType', () => {

  it('should return true for matching types', () => {
    expect(isType(new Foo(), Foo)).toBeTruthy();
  });

  it('should return false for non-matching types', () => {
    expect(isType(new Bar(), Foo)).toBeFalsy();
  });
});
