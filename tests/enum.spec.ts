import { assert } from 'chai';
import { FillEnum, FillEnumOptions, getFullEnumBitmask } from '../src/enum';

describe('enumHelper', () => {
  it('check as key', () => {
    const testEnum = {
      a: 'a',
      b: 'b',
      C: 'C',
      '123Abc': '123Abc',
    } as any;

    const emptyCopy = { ...testEnum } as any;

    Object.keys(emptyCopy).forEach(key => {
      emptyCopy[key] = '';
    });

    FillEnum(emptyCopy, FillEnumOptions.asKey);

    Object.keys(testEnum).forEach(key => {
      assert.equal(testEnum[key], emptyCopy[key]);
    });
  });

  it('check as error', () => {
    const testEnum = {
      a: 'a',
      b: 'b',
      C: 'c',
      '123Abc_Abc': '123abc-abc',
    } as any;

    const emptyCopy = { ...testEnum } as any;

    Object.keys(emptyCopy).forEach(key => {
      emptyCopy[key] = '';
    });

    FillEnum(emptyCopy, FillEnumOptions.asError);

    Object.keys(testEnum).forEach(key => {
      assert.equal(testEnum[key], emptyCopy[key]);
    });
  });
});

describe('enum.getFullEnumBitmask', () => {
  it('{ a: 1, b: 2, c: 4 } => 7', () => {
    // eslint-disable-next-line no-shadow
    enum TestEnum {
      a = 1,
      b = 2,
      c = 4,
    }

    assert.equal(getFullEnumBitmask(TestEnum), 7);
  });

  it('{ a: 1, b: 2, c: 3 } => 3', () => {
    // eslint-disable-next-line no-shadow
    enum TestEnum {
      a,
      b,
      c,
    }

    assert.equal(getFullEnumBitmask(TestEnum), 3);
  });

  it("{ a: 'a', b: 'b' } => 0", () => {
    // eslint-disable-next-line no-shadow
    enum TestEnum {
      a = 'a',
      b = 'b',
    }

    assert.equal(getFullEnumBitmask(TestEnum), 0);
  });

  it("{ a: 'a', b: 1, c: 'c' } => 1", () => {
    // eslint-disable-next-line no-shadow
    enum TestEnum {
      a = 'a',
      b = 1,
      c = 'c',
    }

    assert.equal(getFullEnumBitmask(TestEnum), 1);
  });

  it("{ a: '1', b: '2', c: '3' } => 0", () => {
    // eslint-disable-next-line no-shadow
    enum TestEnum {
      a = '1',
      b = '2',
      c = '3',
    }

    assert.equal(getFullEnumBitmask(TestEnum), 0);
  });

  it('{} => 0', () => {
    // eslint-disable-next-line no-shadow
    enum TestEnum {}

    assert.equal(getFullEnumBitmask(TestEnum), 0);
  });
});
