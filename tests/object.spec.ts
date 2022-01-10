import { assert } from 'chai';
import {
  isObjectHasNonFalseyValue,
  getKeyFromNumericEnum,
} from '../src/object';

describe('objectUtils.isObjectHasNonFalseyValue', () => {
  it('Ложные значения возвращают false', () => {
    const obj = {
      nullK: null,
      falseK: false,
      zeroK: 0,
      stringK: '',
      undefinedK: undefined,
      nanK: NaN,
    };

    assert.isFalse(isObjectHasNonFalseyValue(obj));
  });

  it('Правдивые значения возвращают true', () => {
    assert.isTrue(isObjectHasNonFalseyValue({ key: [] }));
    assert.isTrue(isObjectHasNonFalseyValue({ key: true }));
    assert.isTrue(isObjectHasNonFalseyValue({ key: 1 }));
    assert.isTrue(isObjectHasNonFalseyValue({ key: '1' }));
  });

  it('Поиск ведется также по вложенным объектам', () => {
    const falseObj = {
      innerObj: {
        nullK: null,
        falseK: false,
        zeroK: 0,
        stringK: '',
        undefinedK: undefined,
        nanK: NaN,
      },
    };

    assert.isFalse(isObjectHasNonFalseyValue(falseObj));

    assert.isTrue(isObjectHasNonFalseyValue({ innerObj: { key: [] } }));
    assert.isTrue(isObjectHasNonFalseyValue({ innerObj: { key: true } }));
    assert.isTrue(isObjectHasNonFalseyValue({ innerObj: { key: 1 } }));
    assert.isTrue(isObjectHasNonFalseyValue({ innerObj: { key: '1' } }));
  });

  it('Пустой объект возвращает false', () => {
    assert.isFalse(isObjectHasNonFalseyValue({}));
    assert.isFalse(isObjectHasNonFalseyValue({ innerObj: {} }));
  });
});

describe('objectUtils.getKeyFromNumericEnum', () => {
  it('Возвращает ключ из enum по значению', () => {
    // eslint-disable-next-line no-shadow
    enum Test {
      a = 1,
    }

    assert.equal(getKeyFromNumericEnum(Test, 1), 'a');
  });

  it('Возвращает undefined, если передать значение вне enum', () => {
    // eslint-disable-next-line no-shadow
    enum Test {
      a = 1,
    }

    assert.isUndefined(getKeyFromNumericEnum(Test, 2));
  });
});
