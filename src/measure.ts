export const measure = <F extends (...args: any[]) => any>(func: F, text: string = 'measure'): ReturnType<F> => {
  const st = +new Date();

  const log = () => console.log(text, `${+new Date() - st}ms`);

  const res = func();

  if (res?.constructor === Promise) {
    // @ts-expect-error
    return res.finally(() => log());
  }

  log();

  return res;
};
