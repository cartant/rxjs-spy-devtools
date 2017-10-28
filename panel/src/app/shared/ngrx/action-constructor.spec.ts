import { ActionConstructor } from './action-constructor';
import { Foo } from './test-actions';

describe('ActionConstructor', () => {

  it('should have the shape of action constructors', () => {
    const fooActionConstructor: ActionConstructor<Foo> = Foo;
  });
});
