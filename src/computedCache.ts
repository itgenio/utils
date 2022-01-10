export interface IComputedCache<T> {
  readonly ttl: number;
  readonly isTTLExpired: boolean;

  get(): T;
}

/**
 * Сохраняет в кеш результат выполнения функции.
 * Может иметь время жизни в мс.
 */
export class ComputedCache<T> implements IComputedCache<T> {
  private result?: T;
  private hasResult = false;
  private nextRun = new Date().getTime();

  constructor(
    private readonly computation: () => T,
    public readonly ttl: number = 0
  ) {}

  get isTTLExpired(): boolean {
    return this.ttl > 0 && new Date().getTime() > this.nextRun;
  }

  get(): T {
    if (!this.hasResult || this.isTTLExpired) {
      this.recompute();
    }

    return this.result!;
  }

  private recompute() {
    this.result = this.computation();
    this.hasResult = true;
    this.nextRun = new Date().getTime() + this.ttl;
  }
}
