import { describe, it, expect } from 'vitest';
import { MessageCache } from '../../src/caches/message.ts';

describe('MessageCache', () => {
  it('should store and retrieve values', () => {
    const cache = new MessageCache();

    cache.set('key1', 'value1');
    const cacheValue = cache.get('key1');

    expect(cacheValue).toBe('value1');
  });

  it('should return undefined for non-existent keys', () => {
    const cache = new MessageCache();

    const cacheValue = cache.get('nonexistent');

    expect(cacheValue).toBeUndefined();
  });

  it('should check if key exists', () => {
    const cache = new MessageCache();

    cache.set('key1', 'value1');
    const hasValue = cache.has('key1');

    expect(hasValue).toBe(true);
  });

  it('should clear the cache', () => {
    const cache = new MessageCache();

    cache.set('key1', 'value1');
    cache.clear();
    const hasValue = cache.has('key1');

    expect(hasValue).toBe(false);
  });

  it('should evict oldest entry when max size is reached', () => {
    const cache = new MessageCache(2);

    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3');
    const hasValueKey1 = cache.has('key1');
    const hasValueKey2 = cache.has('key2');
    const hasValueKey3 = cache.has('key3');

    expect(hasValueKey1).toBe(false);
    expect(hasValueKey2).toBe(true);
    expect(hasValueKey3).toBe(true);
  });
});
