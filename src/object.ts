/* eslint-disable arrow-body-style */
import isNil from 'lodash/isNil';
import omitBy from 'lodash/omitBy';

/**
 * Возвращает true, если объект имеет свойство с положительным значением.
 * Поиск также ведется по вложенным объектам
 * @param {Object} object - Объект
 * @return {boolean}
 */
export const isObjectHasNonFalseyValue = (object: any): boolean => {
  return Object.values(object).some((value: any) => {
    if (Boolean(value) && value.constructor === Object) {
      return isObjectHasNonFalseyValue(value);
    }

    return Boolean(value);
  });
};

export const getEnumKeys = <T extends {}>(object: T): (keyof T)[] => {
  return Object.keys(object).filter(
    key => !(parseInt(key, 10) >= 0)
  ) as (keyof T)[];
};

export const getNumericEnumValues = <T extends {}>(object: T): number[] => {
  return Object.values<string | number>(object).reduce((acc, val) => {
    if (typeof val === 'number') {
      acc.push(val);
    }

    return acc;
  }, [] as number[]);
};

export const getKeyFromNumericEnum = <T extends {}>(
  object: T,
  value: T[keyof T]
) => {
  return Object.keys(object).find(
    key =>
      (object[value as unknown as keyof T] as unknown as keyof T) ===
      (key as keyof T)
  ) as keyof T | undefined;
};

/**
 * Убрать из объекта значения null и undefined
 */
export const clearNilValues = <T extends {}>(object: T): T => {
  return omitBy(object, isNil) as T;
};

/**
 * Убрать из объекта опр-ые ложные значения (напр. null, '', undefined)
 */
export const clearFalsyValues = <T extends {}>(
  object: T,
  falsyValues: unknown[] = [null, '', undefined]
): T => {
  const obj = {} as T;

  // eslint-disable-next-line guard-for-in
  for (const key in object) {
    const val = object[key];

    if (!falsyValues.includes(val as any)) {
      obj[key] = val;
    }
  }

  return obj;
};

export const clearMethods = <T extends {}>(object: T): T => {
  return JSON.parse(JSON.stringify(object));
};

export const isObject = (value: any): boolean =>
  Boolean(value) && typeof value === 'object' && value.constructor === Object;

/**
 * Создать словарь, ключями которого являются все элементы перечисления.
 * @param obj - Enum для которого нужно создать словарь
 * @param [initVal] - Значение по умолчанию, которым инициализировать словарь. Может быть функцией.
 */
export const initEnumRecord = <
  T extends Object,
  V extends F extends (K: keyof T) => infer R
    ? unknown extends R
      ? number
      : R
    : F,
  F extends any = (K: keyof T) => unknown
>(
  obj: T,
  initVal: F | number = 0
) =>
  getEnumKeys(obj).reduce((res, key) => {
    res[key] = typeof initVal === 'function' ? initVal(key) : initVal;

    return res;
  }, {} as Record<keyof T, V>);

/**
 * Просуммировать все значения в словаре.
 * @param {Record<string, number>} obj - Словарь, значения которого нужно просуммировать
 * @return {number}
 */
export const sumEnumRecord = <T extends Record<string, number>>(
  obj: T
): number => {
  return Object.values(obj).reduce((sum, val) => sum + val, 0);
};

export const getKeysCount = <T extends {}>(object: T): number => {
  return Object.keys(object).length;
};

// TODO: нормально типизировать
export const flatObject = <T extends {}>(o: T): T => {
  const newObject: any = {};
  const path: string[] = [];

  function flatLevel(obj: any) {
    if (obj !== Object(obj)) {
      // eslint-disable-next-line no-return-assign
      return (newObject[path.join('.')] = obj);
    }

    Object.keys(obj).forEach(key => {
      path.push(key);
      flatLevel(obj[key]);
      path.pop();
    });
  }

  flatLevel(o);

  return newObject;
};
