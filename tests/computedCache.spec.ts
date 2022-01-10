import { assert } from 'chai';
import { ComputedCache } from '../src/computedCache';

describe('computedCache', () => {
  it('сохраняем навсегда строку', () => {
    let counter = 0;

    const cache = new ComputedCache(() => `${counter + 1}`);

    assert.equal(cache.get(), '1');

    counter++;

    assert.equal(cache.get(), '1');
  });

  it('сохраняем строку с TTL', done => {
    let counter = 0;

    const cache = new ComputedCache(() => `${counter + 1}`, 10);

    assert.equal(cache.get(), '1');

    counter++;

    assert.equal(cache.get(), '1');

    setTimeout(() => {
      counter++;

      assert.equal(cache.get(), '3');

      done();
    }, 50);
  });

  it('сохраняем объект', () => {
    const user = { name: 'ivan' };

    const cache = new ComputedCache(() => user);

    assert.deepEqual(cache.get(), { name: 'ivan' });

    user.name = 'dima';

    assert.deepEqual(cache.get(), { name: 'dima' });
  });
});
