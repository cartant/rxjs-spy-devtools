import { ActionConstructor } from './action-constructor';
import { Foo } from './test-actions';

describe('ActionConstructor', () => {

  it('should have the shape of an action constructor', () => {
    const fooActionConstructor: ActionConstructor<Foo> = Foo;
    const type: string = fooActionConstructor.type;
  });
});
