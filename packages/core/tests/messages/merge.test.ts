import { expect, test } from 'vitest';
import { mergeMessages } from '../../src/messages/merge.ts';

test('should keep keys from both sides', () => {
  const result = mergeMessages({ a: 'A' }, { b: 'B' });

  expect(result).toEqual({ a: 'A', b: 'B' });
});

test('should merge nested groups instead of replacing them', () => {
  const result = mergeMessages(
    { home: { title: 'Home', nav: { back: 'Back' } } },
    { home: { nav: { next: 'Next' } } }
  );

  expect(result).toEqual({
    home: { title: 'Home', nav: { back: 'Back', next: 'Next' } },
  });
});

test('should let the source overwrite a message with the same key', () => {
  const result = mergeMessages({ a: 'old' }, { a: 'new' });

  expect(result).toEqual({ a: 'new' });
});

test('should not mutate either input', () => {
  const target = { home: { title: 'Home' } };
  const source = { home: { subtitle: 'Sub' } };

  mergeMessages(target, source);

  expect(target).toEqual({ home: { title: 'Home' } });
  expect(source).toEqual({ home: { subtitle: 'Sub' } });
});
