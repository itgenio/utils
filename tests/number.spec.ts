import { assert } from 'chai';
import { floorToHalf, ceilToHalf, calcMedian, clamp } from '../src/number';

describe('number utils', function () {
  describe('floorToHalf', function () {
    it(`value is floor correctly`, function () {
      const zero = [0.1, 0.2, 0.3, 0.4, 0.4999];

      zero.forEach(n => {
        assert.strictEqual(floorToHalf(n), 0);
      });

      const half = [0.5, 0.55, 0.6, 0.7, 0.8, 0.999, 0.75];

      half.forEach(n => {
        assert.strictEqual(floorToHalf(n), 0.5);
      });

      const integer = [2.1, 2.222, 2.06, 2.405];

      integer.forEach(n => {
        assert.strictEqual(floorToHalf(n), 2);
      });
    });
  });

  describe('ceilToHalf', function () {
    it(`value is ceil correctly`, function () {
      const half = [0.1, 0.2, 0.3, 0.4, 0.4999];

      half.forEach(n => {
        assert.strictEqual(ceilToHalf(n), 0.5);
      });

      const integer = [0.6, 0.7, 0.8, 0.999, 0.75];

      integer.forEach(n => {
        assert.strictEqual(ceilToHalf(n), 1);
      });
    });
  });

  describe('calcMedian', function () {
    it(`Медиана высчитана верно`, function () {
      const nums1 = [1, 3, 5, 7];
      const nums2 = [3, 5, 5, 9, 11];

      assert.strictEqual(calcMedian(nums1), 4);
      assert.strictEqual(calcMedian(nums2), 5);
    });
  });

  describe('clamp', function () {
    it(`Число между min и max`, function () {
      assert.strictEqual(clamp(2, 1, 3), 2);
    });

    it(`Число меньше или равно min`, function () {
      assert.strictEqual(clamp(-1, 1, 3), 1);
      assert.strictEqual(clamp(1, 1, 3), 1);
    });

    it(`Число больше или равно max`, function () {
      assert.strictEqual(clamp(4, 1, 3), 3);
      assert.strictEqual(clamp(3, 1, 3), 3);
    });
  });
});
