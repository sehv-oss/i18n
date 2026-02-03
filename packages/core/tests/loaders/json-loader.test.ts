import { expect, test } from 'vitest';
import { JsonLoader } from '../../src/loaders/json-loader.ts';

test('should support .json extension', () => {
  const loader = new JsonLoader();

  expect(loader.extensions).toEqual(['.json']);
});

test('should parse valid JSON', () => {
  const loader = new JsonLoader();

  const content = '{"greeting": "Hello"}';
  const result = loader.parse(content);

  expect(result).toEqual({
    greeting: 'Hello',
  });
});

test('should throw on invalid JSON', () => {
  const loader = new JsonLoader();

  expect(() => loader.parse('invalid json')).toThrow(
    'Failed to parse JSON: Unexpected token \'i\', "invalid json" is not valid JSON.'
  );
});

test('should throw on non-object JSON', () => {
  const loader = new JsonLoader();

  expect(() => loader.parse('"string"')).toThrow('Invalid messages format!');
});

test('should throw on array JSON', () => {
  const loader = new JsonLoader();

  expect(() => loader.parse('[]')).toThrow('Invalid messages format!');
});

test('should throw on invalid values', () => {
  const loader = new JsonLoader();

  expect(() => loader.parse('{"key": 123}')).toThrow(
    'Invalid messages format!'
  );
});
