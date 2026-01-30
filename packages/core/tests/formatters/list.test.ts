import { describe, it, expect } from 'vitest';
import { FormatList } from '../../src/formatters/list.ts';

describe('FormatList', () => {
  it('should format lists with default options', () => {
    const result = FormatList.format(['a', 'b', 'c'], 'en');

    expect(result).toBe('a, b, and c');
  });

  it('should format lists with disjunction type', () => {
    const result = FormatList.format(['a', 'b', 'c'], 'en', {
      type: 'disjunction',
    });

    expect(result).toBe('a, b, or c');
  });

  it('should format single item lists', () => {
    const result = FormatList.format(['a'], 'en');

    expect(result).toBe('a');
  });

  it('should format empty lists', () => {
    const result = FormatList.format([], 'en');

    expect(result).toBe('');
  });
});
