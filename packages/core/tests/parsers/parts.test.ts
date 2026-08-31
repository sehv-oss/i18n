import { expect, test } from 'vitest';
import { MF2Parser } from '../../src/parsers/mf2-parser.ts';

test('should return one text part for a plain message', () => {
  const parser = new MF2Parser('en');

  expect(parser.parseToParts('Hello!')).toEqual([
    { type: 'text', value: 'Hello!' },
  ]);
});

test('should merge formatted placeholders into the surrounding text', () => {
  const parser = new MF2Parser('en');

  expect(parser.parseToParts('You have {$n} items', { n: 1234 })).toEqual([
    { type: 'text', value: 'You have 1,234 items' },
  ]);
});

test('should surface markup as its own parts', () => {
  const parser = new MF2Parser('en');

  expect(parser.parseToParts('Accept the {#link}terms{/link} now')).toEqual([
    { type: 'text', value: 'Accept the ' },
    { type: 'markup', kind: 'open', name: 'link' },
    { type: 'text', value: 'terms' },
    { type: 'markup', kind: 'close', name: 'link' },
    { type: 'text', value: ' now' },
  ]);
});

test('should return the source as text when the message does not compile', () => {
  const parser = new MF2Parser('en');
  const source = '.match $broken';

  expect(parser.parseToParts(source, {}, () => {})).toEqual([
    { type: 'text', value: source },
  ]);
});
