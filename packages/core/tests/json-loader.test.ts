import { describe, it, expect } from 'vitest';
import { JsonLoader } from '../src/loaders/json-loader.ts';

describe('JsonLoader', () => {
  const loader = new JsonLoader();

  describe('extensions', () => {
    it('should support .json extension', () => {
      expect(loader.extensions).toContain('.json');
    });
  });

  describe('parse', () => {
    it('should parse valid JSON', () => {
      const content = '{"greeting": "Hello", "nested": {"key": "value"}}';
      const result = loader.parse(content);

      expect(result).toEqual({
        greeting: 'Hello',
        nested: { key: 'value' },
      });
    });

    it('should throw on invalid JSON', () => {
      expect(() => loader.parse('invalid json')).toThrow(
        'Failed to parse JSON'
      );
    });

    it('should throw on non-object JSON', () => {
      expect(() => loader.parse('"string"')).toThrow(
        'Invalid message dictionary format'
      );
    });

    it('should throw on array JSON', () => {
      expect(() => loader.parse('[]')).toThrow(
        'Invalid message dictionary format'
      );
    });
  });
});
