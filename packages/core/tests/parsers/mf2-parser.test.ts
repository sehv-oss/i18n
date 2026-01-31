import { expect, test } from 'vitest';
import { MF2Parser } from '../../src/parsers/mf2-parser.ts';

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

test('should select correct plural form for English', () => {
  const parser = new MF2Parser('en');

  const message = `.match {$count :number}
one {{You have {$count} item}}
*   {{You have {$count} items}}`;
  const result1 = parser.parse(message, { count: 1 });
  const result5 = parser.parse(message, { count: 5 });

  expect(result1).toBe('You have 1 item');
  expect(result5).toBe('You have 5 items');
});

test('should select correct plural form for other locales', () => {
  const parser = new MF2Parser('de');

  const message = `.match {$count :number}
one {{You have {$count} item}}
*   {{You have {$count} items}}`;
  const result1 = parser.parse(message, { count: 1 });
  const result5 = parser.parse(message, { count: 5 });

  expect(result1).toBe('You have 1 item');
  expect(result5).toBe('You have 5 items');
});

test('should select based on string value', () => {
  const parser = new MF2Parser('en');
  const message = `.match {$gender}
male   {{He went to the store}}
female {{She went to the store}}
*      {{They went to the store}}`;
  const resultMale = parser.parse(message, { gender: 'male' });
  const resultFemale = parser.parse(message, { gender: 'female' });
  const resultOther = parser.parse(message, { gender: 'other' });

  expect(resultMale).toBe('He went to the store');
  expect(resultFemale).toBe('She went to the store');
  expect(resultOther).toBe('They went to the store');
});

test('should return simple pattern when first line does not start with .match', () => {
  const parser = new MF2Parser('en');
  const message = `some text
.match {$count :number}
one {{One}}
*   {{Many}}`;

  const result = parser.parse(message, { count: 1 });

  expect(result).toBe(message);
});

test('should return original message when match has no selectors', () => {
  const parser = new MF2Parser('en');
  const message = `.match
one {{One item}}
*   {{Multiple items}}`;

  const result = parser.parse(message, {});

  expect(result).toBe(message);
});

test('should return empty string when no variant matches and no fallback', () => {
  const parser = new MF2Parser('en');
  const message = `.match {$count :number}
one {{One item}}`;

  const result = parser.parse(message, { count: 5 });

  expect(result).toBe('');
});

test('should handle empty message', () => {
  const parser = new MF2Parser('en');

  const result = parser.parse('', {});

  expect(result).toBe('');
});

test('should handle whitespace only message', () => {
  const parser = new MF2Parser('en');

  const result = parser.parse('   ', {});

  expect(result).toBe('');
});

test('should handle undefined value as wildcard', () => {
  const parser = new MF2Parser('en');
  const message = `.match {$status}
active   {{Active}}
*        {{Unknown}}`;

  const result = parser.parse(message, {});

  expect(result).toBe('Unknown');
});

test('should handle mismatched selector and variant key counts', () => {
  const parser = new MF2Parser('en');
  const message = `.match {$a} {$b}
one {{Single key variant}}
* * {{Double key variant}}`;

  const result = parser.parse(message, { a: 'x', b: 'y' });

  expect(result).toBe('Double key variant');
});

test('should handle invalid variant lines gracefully', () => {
  const parser = new MF2Parser('en');
  const message = `.match {$count :number}
invalid line without pattern
one {{One item}}
*   {{Multiple items}}`;

  const result = parser.parse(message, { count: 1 });

  expect(result).toBe('One item');
});
