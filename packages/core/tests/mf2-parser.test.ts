import { describe, it, expect } from 'vitest';
import { MF2Parser } from '../src/parsers/mf2-parser.ts';

describe('MF2Parser', () => {
  describe('simple interpolation', () => {
    it('should interpolate variables', () => {
      const parser = new MF2Parser('en');
      const result = parser.parse('Hello, {$name}!', { name: 'World' });
      expect(result).toBe('Hello, World!');
    });

    it('should handle multiple variables', () => {
      const parser = new MF2Parser('en');
      const result = parser.parse('{$greeting}, {$name}!', {
        greeting: 'Hi',
        name: 'John',
      });
      expect(result).toBe('Hi, John!');
    });

    it('should keep placeholder if value not provided', () => {
      const parser = new MF2Parser('en');
      const result = parser.parse('Hello, {$name}!', {});
      expect(result).toBe('Hello, {$name}!');
    });
  });

  describe('plural selection', () => {
    it('should select correct plural form for English', () => {
      const parser = new MF2Parser('en');
      const message = `.match {$count :number}
one {{You have {$count} item}}
*   {{You have {$count} items}}`;

      expect(parser.parse(message, { count: 1 })).toBe('You have 1 item');
      expect(parser.parse(message, { count: 5 })).toBe('You have 5 items');
    });

    it('should select correct plural form for Portuguese', () => {
      const parser = new MF2Parser('pt-BR');
      const message = `.match {$count :number}
one {{Você tem {$count} item}}
*   {{Você tem {$count} itens}}`;

      expect(parser.parse(message, { count: 1 })).toBe('Você tem 1 item');
      expect(parser.parse(message, { count: 5 })).toBe('Você tem 5 itens');
    });
  });

  describe('simple selection', () => {
    it('should select based on string value', () => {
      const parser = new MF2Parser('en');
      const message = `.match {$gender}
male   {{He went to the store}}
female {{She went to the store}}
*      {{They went to the store}}`;

      expect(parser.parse(message, { gender: 'male' })).toBe(
        'He went to the store'
      );
      expect(parser.parse(message, { gender: 'female' })).toBe(
        'She went to the store'
      );
      expect(parser.parse(message, { gender: 'other' })).toBe(
        'They went to the store'
      );
    });
  });
});
