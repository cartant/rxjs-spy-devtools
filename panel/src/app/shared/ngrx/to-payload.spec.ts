import { ActionWithPayload } from './action-with-payload';
import { toPayload } from './to-payload';

describe('toPayload', () => {

  it('should obtain the payload', () => {
    const payload: number = toPayload({ payload: 42, type: 'FOO' });
    expect(payload).toEqual(42);
  });
});
