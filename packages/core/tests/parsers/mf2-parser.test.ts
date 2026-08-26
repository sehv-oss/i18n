import { expect, test, vi } from 'vitest';
import { MF2Parser } from '../../src/parsers/mf2-parser.ts';

const PLURAL = `.input {$count :number}
.match $count
one {{You have {$count} item}}
*   {{You have {$count} items}}`;

const GENDER = `.input {$gender :string}
.match $gender
male   {{He went to the store}}
female {{She went to the store}}
*      {{They went to the store}}`;

test('should interpolate variables', () => {
  const parser = new MF2Parser('en');

  const result = parser.parse('Hello, {$name}!', { name: 'World' });

  expect(result).toBe('Hello, World!');
});

test('should handle multiple variables', () => {
  const parser = new MF2Parser('en');

  const result = parser.parse('{$greeting}, {$name}!', {
    greeting: 'Hi',
    name: 'John',
  });

  expect(result).toBe('Hi, John!');
});

test('should keep placeholder if value not provided', () => {
  const parser = new MF2Parser('en');

  const result = parser.parse('Hello, {$name}!', {});

  expect(result).toBe('Hello, {$name}!');
});

test('should report an unresolved variable through onError', () => {
  const parser = new MF2Parser('en');
  const onError = vi.fn();

  parser.parse('Hello, {$name}!', {}, onError);

  expect(onError).toHaveBeenCalledOnce();
});

test('should stay silent when no error handler is given', () => {
  const parser = new MF2Parser('en');

  expect(() => parser.parse('Hello, {$name}!', {})).not.toThrow();
});

test('should select correct plural form for English', () => {
  const parser = new MF2Parser('en');

  const result1 = parser.parse(PLURAL, { count: 1 });
  const result5 = parser.parse(PLURAL, { count: 5 });

  expect(result1).toBe('You have 1 item');
  expect(result5).toBe('You have 5 items');
});

test('should select correct plural form for other locales', () => {
  const parser = new MF2Parser('pl');
  const message = `.input {$count :number}
.match $count
one  {{{$count} plik}}
few  {{{$count} pliki}}
many {{{$count} plików}}
*    {{{$count} pliku}}`;

  expect(parser.parse(message, { count: 1 })).toBe('1 plik');
  expect(parser.parse(message, { count: 3 })).toBe('3 pliki');
  expect(parser.parse(message, { count: 5 })).toBe('5 plików');
});

test('should prefer an exact numeric key over the plural category', () => {
  const parser = new MF2Parser('en');
  const message = `.input {$count :number}
.match $count
0   {{No items}}
one {{One item}}
*   {{{$count} items}}`;

  expect(parser.parse(message, { count: 0 })).toBe('No items');
  expect(parser.parse(message, { count: 1 })).toBe('One item');
  expect(parser.parse(message, { count: 7 })).toBe('7 items');
});

test('should select based on string value', () => {
  const parser = new MF2Parser('en');

  const resultMale = parser.parse(GENDER, { gender: 'male' });
  const resultFemale = parser.parse(GENDER, { gender: 'female' });
  const resultOther = parser.parse(GENDER, { gender: 'other' });

  expect(resultMale).toBe('He went to the store');
  expect(resultFemale).toBe('She went to the store');
  expect(resultOther).toBe('They went to the store');
});

test('should resolve a local declaration', () => {
  const parser = new MF2Parser('en');
  const message = `.local $total = {$count :number}
{{Total: {$total}}}`;

  const result = parser.parse(message, { count: 5 });

  expect(result).toBe('Total: 5');
});

test('should format with the draft functions', () => {
  const parser = new MF2Parser('en');

  const date = parser.parse('Today is {$d :date style=long}', {
    d: new Date('2025-03-01T12:00:00Z'),
  });
  const currency = parser.parse('Cost {$v :currency currency=USD}', {
    v: 99.9,
  });

  expect(date).toBe('Today is Mar 1, 2025');
  expect(currency).toBe('Cost $99.90');
});

test('should handle empty message', () => {
  const parser = new MF2Parser('en');

  const result = parser.parse('', {});

  expect(result).toBe('');
});

test('should preserve a whitespace only message', () => {
  const parser = new MF2Parser('en');

  const result = parser.parse('   ', {});

  expect(result).toBe('   ');
});

test('should return the source and report the error for invalid syntax', () => {
  const parser = new MF2Parser('en');
  const message = `.match {$count :number}
one {{One item}}
*   {{Multiple items}}`;
  const onError = vi.fn();

  const result = parser.parse(message, { count: 1 }, onError);

  expect(result).toBe(message);
  expect(onError).toHaveBeenCalledOnce();
});

test('should reject a match selector without an input declaration', () => {
  const parser = new MF2Parser('en');
  const message = `.match $count
one {{One item}}
*   {{Multiple items}}`;
  const onError = vi.fn();

  const result = parser.parse(message, { count: 1 }, onError);

  expect(result).toBe(message);
  expect(onError).toHaveBeenCalledOnce();
});

test('should format the same message repeatedly with different values', () => {
  const parser = new MF2Parser('en');

  expect(parser.parse(PLURAL, { count: 1 })).toBe('You have 1 item');
  expect(parser.parse(PLURAL, { count: 5 })).toBe('You have 5 items');
  expect(parser.parse(PLURAL, { count: 1 })).toBe('You have 1 item');
});

test('should isolate placeholders when bidiIsolation is default', () => {
  const parser = new MF2Parser('en', { bidiIsolation: 'default' });

  const result = parser.parse('Hello, {$name}!', { name: 'World' });

  expect(result).toBe('Hello, ⁨World⁩!');
});
