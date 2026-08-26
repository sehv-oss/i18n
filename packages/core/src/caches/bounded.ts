export class BoundedCache<TValue> {
  private cache = new Map<string, TValue>();
  private maxSize: number;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): TValue | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: TValue): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;

      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
