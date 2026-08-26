import { expect, test } from 'vitest';
import { BoundedCache } from '../../src/caches/bounded.ts';

test('should store and retrieve values', () => {
  const cache = new BoundedCache<string>();

  cache.set('key1', 'value1');
  const cacheValue = cache.get('key1');

  expect(cacheValue).toBe('value1');
});

test('should return undefined for non-existent keys', () => {
  const cache = new BoundedCache<string>();

  const cacheValue = cache.get('nonexistent');

  expect(cacheValue).toBeUndefined();
});

test('should check if key exists', () => {
  const cache = new BoundedCache<string>();

  cache.set('key1', 'value1');
  const hasValue = cache.has('key1');

  expect(hasValue).toBe(true);
});

test('should clear the cache', () => {
  const cache = new BoundedCache<string>();

  cache.set('key1', 'value1');
  cache.clear();
  const hasValue = cache.has('key1');

  expect(hasValue).toBe(false);
});

test('should evict oldest entry when max size is reached', () => {
  const cache = new BoundedCache<string>(2);

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

test('should evict an empty string key when max size is reached', () => {
  const cache = new BoundedCache<string>(1);

  cache.set('', 'value1');
  cache.set('key2', 'value2');
  const hasEmptyKey = cache.has('');
  const hasValueKey2 = cache.has('key2');

  expect(hasEmptyKey).toBe(false);
  expect(hasValueKey2).toBe(true);
});
