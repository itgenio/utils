// использование Math.round() даст неравномерное распределение!
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Округляет число в меньшую сторону до половины
 * @param value - число
 * @returns - округленное число
 */
export function floorToHalf(value: number): number {
  const temp = Math.floor(value);
  value -= temp;

  if (value >= 0.5) return temp + 0.5;

  return temp;
}

/**
 * Округляет число в большую сторону до половины
 * @param value - число
 * @returns - округленное число
 */
export function ceilToHalf(value: number): number {
  const temp = Math.ceil(value);
  value -= temp;

  if (value <= -0.40001) return temp - 0.5;

  return temp;
}

/**
 * Получить медиану
 */
export function calcMedian(numbers: number[]): number {
  if (!numbers.length) return 0;

  const mid = Math.floor(numbers.length / 2);
  const nums = [...numbers].sort((a, b) => a - b);

  return numbers.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}

/**
 * Возвращает число num, если оно находится на числовом отрезке min-max.
 * Иначе обрезает либо до меньшего min, либо до большего max
 */
export function clamp(num: number, min: number, max: number): number {
  return num <= min ? min : num >= max ? max : num;
}

/**
 * См. clamp. при min = 0, max = 1
 */
export function clamp01(num: number): number {
  return clamp(num, 0, 1);
}

/**
 * Округлить число с плавающей точкой
 * @param num - число
 * @param maxDigits - максимальное количество чисел после запятой
 */
export function roundFloat(num: number, maxDigits: number) {
  // eslint-disable-next-line no-implicit-coercion
  return +num.toFixed(maxDigits);
}

const EPSILON = 0.0001;

export function isNumbersEq(compareWith: number, ...nums: number[]) {
  if (nums.length === 0) return false;

  return nums.every(n => Math.abs(Math.abs(n) - compareWith) < EPSILON);
}
