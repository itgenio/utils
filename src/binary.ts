type Bitmask = number;

export const createBinaryMask = (...flags: number[]) =>
  flags.reduce((mask, flag) => mask | flag, 0);

export const isFlagInBinaryMask = (mask: Bitmask, flag: number) =>
  (mask & flag) === flag;

export const isMasksIntersect = (maskA: Bitmask, maskB: Bitmask) =>
  (maskA & maskB) !== 0;

export const addFlagToMask = (mask: Bitmask, flag: number) => mask | flag;

export const removeFlagFromMask = (mask: Bitmask, flag: number) =>
  mask - (mask & flag);
