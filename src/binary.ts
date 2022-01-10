type Bitmask = number;

export const createBinaryMask = (...flags: number[]) => {
  return flags.reduce((mask, flag) => mask | flag, 0);
};

export const isFlagInBinaryMask = (mask: Bitmask, flag: number) => {
  return (mask & flag) === flag;
};

export const addFlagToMask = (mask: Bitmask, flag: number) => {
  return mask | flag;
};

export const removeFlagFromMask = (mask: Bitmask, flag: number) => {
  return mask - (mask & flag);
};
