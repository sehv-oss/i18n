import { describe, it, expect } from 'vitest';
import { JsonLoader } from '../../src/loaders/json-loader.ts';

describe('JsonLoader', () => {
  const loader = new JsonLoader();

  describe('extensions', () => {
    it('should support .json extension', () => {
      expect(loader.extensions).toContain('.json');
    });
  });

  describe('parse', () => {
    it('should parse valid JSON', () => {
      const content = '{"greeting": "Hello"}';
      const result = loader.parse(content);

      expect(result).toEqual({
        greeting: 'Hello',
      });
    });

    it('should throw on invalid JSON', () => {
      expect(() => loader.parse('invalid json')).toThrow(
        'Failed to parse JSON: Unexpected token \'i\', "invalid json" is not valid JSON.'
      );
    });

    it('should throw on non-object JSON', () => {
      expect(() => loader.parse('"string"')).toThrow(
        'Invalid messages format!'
      );
    });

    it('should throw on array JSON', () => {
      expect(() => loader.parse('[]')).toThrow('Invalid messages format!');
    });

    it('should throw on invalid values', () => {
      expect(() => loader.parse('{"key": 123}')).toThrow(
        'Invalid messages format!'
      );
    });
  });
});
