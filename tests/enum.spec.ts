import { assert } from 'chai';
import { FillEnum, FillEnumOptions } from '../src/enum';

describe('enumHelper', function () {
  it(`check as key`, function () {
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

  it(`check as error`, function () {
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
