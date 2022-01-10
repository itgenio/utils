import { assert } from 'chai';
import {
  sortDocumentsByFieldOrder,
  chunkArray,
  convertDictToArray,
} from '../src/array';

describe('array', function () {
  describe(`sortDocumentsByFieldOrder`, function () {
    it(`Массив сортируется в соответствии с переданным массивом значений`, function () {
      const array = [{ id: 1 }, { id: 2 }];
      const order = [2, 1];

      assert.deepEqual(
        array.sort((a, b) =>
          sortDocumentsByFieldOrder(a, b, order, doc => doc.id)
        ),
        [{ id: 2 }, { id: 1 }]
      );
    });

    it(`Объекты, которых нет в массиве, идут в конец`, function () {
      const array = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const order = [3, 1];

      assert.deepEqual(
        array.sort((a, b) =>
          sortDocumentsByFieldOrder(a, b, order, doc => doc.id)
        ),
        [{ id: 3 }, { id: 1 }, { id: 2 }]
      );
    });
  });

  describe(`chunkArray`, function () {
    it(`Массив разбит на подмассивы`, function () {
      const array = [1, 2, 3, 4];

      assert.deepEqual(chunkArray(array, 2), [
        [1, 2],
        [3, 4],
      ]);
    });

    it(`Если недостаточно элементов для создания последнего подмассива, то берется остаток`, function () {
      const array = [1, 2, 3, 4, 5];

      assert.deepEqual(chunkArray(array, 3), [
        [1, 2, 3],
        [4, 5],
      ]);
    });
  });

  describe(`convertDictToArray`, function () {
    it(`Словарь массивов преобразован в массив`, function () {
      const dict = { a: [1, 2], b: [4, 2], c: [1, 4] };

      const array = convertDictToArray(dict, (key, value) => {
        return { id: key, num: value };
      });

      const result = [
        { id: 'a', num: 1 },
        { id: 'a', num: 2 },
        { id: 'b', num: 4 },
        { id: 'b', num: 2 },
        { id: 'c', num: 1 },
        { id: 'c', num: 4 },
      ];

      assert.deepEqual(array, result);
    });

    it(`Словарь различных значений преобразован в массив`, function () {
      const dict = { a: [1, 2], b: 4, c: 'test', d: { g: 1, h: 1 } };

      const array = convertDictToArray(dict, (key, value) => {
        return { id: key, someVal: value };
      });

      const result = [
        { id: 'a', someVal: 1 },
        { id: 'a', someVal: 2 },
        { id: 'b', someVal: 4 },
        { id: 'c', someVal: 'test' },
        { id: 'd', someVal: { g: 1, h: 1 } },
      ];

      assert.deepEqual(array, result);
    });
  });
});
