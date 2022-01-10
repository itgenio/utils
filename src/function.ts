import { wait } from './promise';

type EmptyFunction<T = any> = {
  (): Promise<T>;
};

type CheckFunc<T = any> = {
  (arg: T): boolean;
};

/**
 * Функция повтора процедуры с экспоненциальным откладыванием выполнения
 * @template T
 * @param {EmptyFunction<T>>} func - Процедура
 * @param {CheckFunc<T>} isOk - Функция подтверждения успешности выполнения процедуры
 * @param {number} retries - Максимальное количество попыток выполнения
 * @param {number} delay - количество миллисекунд для паузы перед первым повтором (базовое время ожидания для расчета следующей задержки)
 * @return {T}
 */
export const backoff = async <T = any>(
  func: EmptyFunction<T>,
  isOk: CheckFunc<T>,
  retries: number = 5,
  delay: number = 300
): Promise<T> => {
  const result: T = await func();

  if (isOk(result) || retries <= 1) {
    return result;
  }

  await wait(delay);
  return await backoff(func, isOk, retries - 1, delay * 2);
};
