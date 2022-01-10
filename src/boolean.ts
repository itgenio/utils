export const stringToBoolean = (value: unknown) => {
  const type = typeof value;

  if (type === 'string') {
    return value == 'true';
  }

  return !!value;
};
