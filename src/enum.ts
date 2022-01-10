export const FillEnumOptions = {
  asKey: 0,
  asError: 1,
};

export const FillEnum = (
  enumObject: any,
  fillOption = FillEnumOptions.asKey
) => {
  const keys = Object.keys(enumObject);

  keys.forEach(key => {
    if (fillOption === FillEnumOptions.asKey) enumObject[key] = key;
    else if (fillOption === FillEnumOptions.asError)
      enumObject[key] = key.toLowerCase().replace(new RegExp('_', 'g'), '-');
    else throw new Error('not implemented option:' + fillOption);
  });

  return enumObject;
};
