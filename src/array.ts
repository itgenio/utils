/**
 * @deprecated
 */
// @ts-ignore
// eslint-disable-next-line no-extend-native
Array.prototype.getUnique = function () {
  return unique(this);
};

/**
 * @deprecated
 */
// @ts-ignore
// eslint-disable-next-line no-extend-native
Array.prototype.getLastOrNull = function () {
  return lastOrNull(this);
};

export function unique<T extends any[]>(arr: T): T {
  return [...new Set(arr)] as T;
}

export function lastOrNull<T extends any[]>(arr: T) {
  if (!arr) return null;
  if (arr.length === 0) return null;

  return arr[arr.length - 1];
}

export const flatArray = <T extends any[]>(arr: T[]): T =>
  arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flatArray(val)) : acc.concat(val),
    [] as any[]
  ) as T;

/**
 * Функция сортировки объектов по заданному порядку значений определенного поля
 * @param {Object} a - Первый объект
 * @param {Object} b - Второй объект
 * @param {*[]} fieldOrder - Массив значений, в соответствии с которым должна производиться сортировка
 * @param {Function} getFieldFunc - Функция для взятия значения из необходимого поля
 * @return {number}
 */
export const sortDocumentsByFieldOrder = <
  TObj,
  TFieldOrder extends ReadonlyArray<any>
>(
  a: TObj,
  b: TObj,
  fieldOrder: TFieldOrder,
  getFieldFunc: (_obj: TObj) => any
) => {
  const aFieldValue = getFieldFunc(a);
  const bFieldValue = getFieldFunc(b);
  const aIndex = fieldOrder.findIndex(el => el === aFieldValue);
  const bIndex = fieldOrder.findIndex(el => el === bFieldValue);

  if (aIndex === -1) return 1;
  if (bIndex === -1) return -1;

  return aIndex - bIndex;
};

/**
 * Отсортировать массив по заданным функциям
 * @param {Array} arr - Массив
 * @param {...Function} getScoreFunctions - Функции, которые будут вызваны для элементов. Возвращаемое значение идентично возвращаемому значению compareFunction, передаваемой в sort(). При сравнении будут вызываться друг за другом, пока не будет получено ненулевое значение, либо функции не закончатся
 * @return {Array}
 */
export const sortByFunctions = (arr: any[], ...getScoreFunctions: any[]) =>
  arr.sort((a, b) => {
    for (const getScore of getScoreFunctions) {
      const compareResult = getScore(a) - getScore(b);

      if (compareResult !== 0) return compareResult;
    }

    return 0;
  });

/**
 * Конвертировать массив объектов в словарь
 * @param {any[]} arr - Исходный массив
 * @param {Function} getKey - Функция для получения ключа из объекта
 * @param {Function} [getVal] - Функция для получения значения из объекта. Если не передано, возвращается весь объект
 * @return {any}
 */
export const convertToDict = <
  T,
  TKey extends string | number | symbol,
  TVal = T
>(
  arr: T[],
  getKey: (_: T) => TKey,
  getVal?: (_: T) => TVal
): Record<TKey, TVal> =>
  arr.reduce((dict, el) => {
    dict[getKey(el)] = getVal ? getVal(el) : (el as unknown as TVal);

    return dict;
  }, {} as Record<TKey, TVal>);

/**
 * Конвертировать словарь в массив объектов
 * @param {any} dict - Исходный словарь
 * @param {Function} getKeys - Функция для получения названия ключей для объектов
 * @return {any[]}
 */
export const convertDictToArray = <T extends Record<string, any>, R>(
  dict: T,
  getKeys: (_key: string, _value: any) => R
): R[] => {
  const keys = Object.keys(dict);

  return flatArray(
    keys.map(key => {
      const values = Array.isArray(dict[key]) ? dict[key] : [dict[key]];

      return values.map((value: any) => getKeys(key, value));
    })
  );
};

/**
 * Разбить массив на подмассивы
 * @param {any[]} array - исходный массив
 * @param {number} size - кол-во элементов подмассива
 * @returns {any[]}
 */

type Unboxed<T> = T extends (infer U)[] ? U : T;

export const chunkArray = <T extends any[], S extends Unboxed<T>>(
  array: T,
  size: number
) => {
  const newArray: S[][] = [
    ...Array(Number(Math.ceil(array.length / size))),
  ].map(() => []);

  let newArrayIndex = 0;

  array.forEach((item, i) => {
    newArray[newArrayIndex].push(item);

    if ((i + 1) % size === 0) {
      newArrayIndex++;
    }
  });

  return newArray;
};

/**
 * Конвертировать массив объектов в словарь и объединить по ключу
 * @param array - Исходный массив
 * @param getKey - Функция для получения ключа из объекта
 * @param [getVal] - Функция для преобразования сгруппированных элементов массива. Если не передана, возвращаются сгруппированные элементы
 * @returns - Record<ключ, элементы сгруппированные по этому ключу (если передедан getVal, то модифицированные через getVal)>
 */
export const groupByPropertyToDict = <
  T extends {},
  TKey extends string | number | symbol,
  TVal = T[]
>(
  array: T[],
  getKey: (_: T) => TKey,
  getVal?: (_: T[], __: TKey) => TVal
): Record<TKey, TVal> => {
  // TODO: types
  const result: Record<any, any[]> = {};

  for (const element of array) {
    const key = getKey(element);

    if (!result[key]) {
      result[key] = [element];
    } else {
      result[key].push(element);
    }
  }

  if (!getVal) return result as any;

  Object.values(result).forEach(arr => {
    const key = getKey(arr[0]);

    result[key] = getVal(arr, key) as any;
  });

  return result as any;
};

export const moveElementInArray = <T extends Array<any>>(
  arr: T,
  oldIndex: number,
  newIndex: number
) => {
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);

  return arr;
};

/**
 * Вернуть массив элементов, присутствующих только в массиве arrA (разница A - B)
 * @param {Object[]} arrA - массив для поиска новых значений
 * @param {Object[]} arrB - массив для фильтрации
 * @param {function} [equalFunc] - функция сравнения элементов массивов
 * @return
 */
export const arrayDifference = <T>(
  arrA: T[],
  arrB: T[],
  equalFunc?: <P extends T>(_a: P, _b: P) => boolean
): T[] => {
  const isEqual = equalFunc || ((a, b) => a === b);

  return arrA.filter(a => !arrB.some(b => isEqual(a, b)));
};

/**
 * Вернуть массив элементов, присутствующих в обоих массивах (A ∩ B)
 * @param {Object[]} arrA - массив для поиска пересекающихся элементов
 * @param {Object[]} arrB - массив для поиска пересекающихся элементов
 * @param {function} [equalFunc] - функция сравнения элементов массивов
 * @return
 */
export const arrayIntersection = <T>(
  arrA: T[],
  arrB: T[],
  equalFunc?: <P extends T>(_a: P, _b: P) => boolean
): T[] => {
  const isEqual = equalFunc || ((a, b) => a === b);

  return [...new Set(arrA.filter(a => arrB.some(b => isEqual(a, b))))];
};
