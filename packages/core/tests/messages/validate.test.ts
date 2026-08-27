import { expect, test } from 'vitest';
import {
  extractPlaceholders,
  validateMessages,
} from '../../src/messages/validate.ts';

test('should read the placeholders out of a message', () => {
  expect(extractPlaceholders('Hello, {$name}!')).toEqual(['name']);
  expect(extractPlaceholders('{$a} and {$b}')).toEqual(['a', 'b']);
});

test('should read only the head segment of a dotted path', () => {
  expect(extractPlaceholders('{$user.name}')).toEqual(['user']);
});

test('should ignore the annotation after a placeholder name', () => {
  expect(extractPlaceholders('{$count :number}')).toEqual(['count']);
});

test('should ignore an escaped brace', () => {
  expect(extractPlaceholders('\\{$notAPlaceholder}')).toEqual([]);
});

test('should deduplicate repeated placeholders', () => {
  expect(extractPlaceholders('{$n} of {$n}')).toEqual(['n']);
});

test('should report nothing for an identical dictionary', () => {
  const reference = { greeting: 'Hello, {$name}!', home: { title: 'Home' } };
  const target = { greeting: 'Olá, {$name}!', home: { title: 'Início' } };

  expect(validateMessages(reference, target)).toEqual({
    missing: [],
    extra: [],
    mismatched: [],
  });
});

test('should report keys the target is missing', () => {
  const result = validateMessages(
    { a: 'A', home: { title: 'Home', nav: 'Back' } },
    { a: 'A', home: { title: 'Início' } }
  );

  expect(result.missing).toEqual(['home.nav']);
});

test('should report keys the target has and the reference does not', () => {
  const result = validateMessages({ a: 'A' }, { a: 'A', b: 'B' });

  expect(result.extra).toEqual(['b']);
});

test('should report a placeholder the translation dropped', () => {
  const result = validateMessages(
    { greeting: 'Hello, {$name}!' },
    { greeting: 'Olá!' }
  );

  expect(result.mismatched).toEqual([
    { key: 'greeting', expected: ['name'], actual: [] },
  ]);
});

test('should report a placeholder the translation invented', () => {
  const result = validateMessages({ a: 'A' }, { a: 'A {$stray}' });

  expect(result.mismatched).toEqual([
    { key: 'a', expected: [], actual: ['stray'] },
  ]);
});

test('should treat a group where a message was expected as missing', () => {
  const result = validateMessages({ a: 'A' }, { a: { b: 'B' } });

  expect(result.missing).toEqual(['a']);
});
