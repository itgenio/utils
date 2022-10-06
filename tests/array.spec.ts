import { assert } from 'chai';
import {
  asyncFilter,
  chunkArray,
  convertDictToArray,
  sortDocumentsByFieldOrder,
} from '../src/array';

describe('array', () => {
  describe('sortDocumentsByFieldOrder', () => {
    it('Массив сортируется в соответствии с переданным массивом значений', () => {
      const array = [{ id: 1 }, { id: 2 }];
      const order = [2, 1];

      assert.deepEqual(
        array.sort((a, b) =>
          sortDocumentsByFieldOrder(a, b, order, doc => doc.id)
        ),
        [{ id: 2 }, { id: 1 }]
      );
    });

    it('Объекты, которых нет в массиве, идут в конец', () => {
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

  describe('chunkArray', () => {
    it('Массив разбит на подмассивы', () => {
      const array = [1, 2, 3, 4];

      assert.deepEqual(chunkArray(array, 2), [
        [1, 2],
        [3, 4],
      ]);
    });

    it('Если недостаточно элементов для создания последнего подмассива, то берется остаток', () => {
      const array = [1, 2, 3, 4, 5];

      assert.deepEqual(chunkArray(array, 3), [
        [1, 2, 3],
        [4, 5],
      ]);
    });
  });

  describe('convertDictToArray', () => {
    it('Словарь массивов преобразован в массив', () => {
      const dict = { a: [1, 2], b: [4, 2], c: [1, 4] };

      const array = convertDictToArray(dict, (key, value) => ({
        id: key,
        num: value,
      }));

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

    it('Словарь различных значений преобразован в массив', () => {
      const dict = { a: [1, 2], b: 4, c: 'test', d: { g: 1, h: 1 } };

      const array = convertDictToArray(dict, (key, value) => ({
        id: key,
        someVal: value,
      }));

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

  describe('asyncFilter', () => {
    it('Отфильтрован массив', async () => {
      const array = [
        { value: 1, filter: Promise.resolve(true) },
        { value: 2, filter: Promise.resolve(false) },
        {
          value: 3,
          filter: new Promise<boolean>(resolve =>
            setTimeout(() => resolve(true), 0)
          ),
        },
        {
          value: 4,
          filter: new Promise<boolean>(resolve =>
            setTimeout(() => resolve(false), 0)
          ),
        },
        {
          value: 5,
          filter: true,
        },
        {
          value: 6,
          filter: false,
        },
      ];

      const filteredArray = await asyncFilter(array, item => item.filter);

      assert.deepEqual(
        filteredArray.map(item => item.value),
        [1, 3, 5]
      );
    });

    it('Учитывается порядок в исходном массиве', async () => {
      const array = [
        {
          value: 1,
          filter: new Promise<boolean>(resolve =>
            setTimeout(() => resolve(true), 10)
          ),
        },
        {
          value: 2,
          filter: new Promise<boolean>(resolve =>
            setTimeout(() => resolve(true), 5)
          ),
        },
      ];

      const filteredArray = await asyncFilter(array, item => item.filter);

      assert.deepEqual(
        filteredArray.map(item => item.value),
        [1, 2]
      );
    });

    it('Ошибки в промисах не ломают фильтрацию', async () => {
      const array = [
        {
          value: 1,
          filter: new Promise<boolean>((resolve, reject) =>
            setTimeout(() => reject(new Error()), 0)
          ),
        },
        {
          value: 2,
          filter: new Promise<boolean>(resolve =>
            setTimeout(() => resolve(true), 0)
          ),
        },
      ];

      const filteredArray = await asyncFilter(array, item => item.filter);

      assert.deepEqual(
        filteredArray.map(item => item.value),
        [2]
      );
    });
  });
});
