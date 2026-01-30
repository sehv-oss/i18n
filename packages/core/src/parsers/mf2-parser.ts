import type { IParser } from './parser.interface.ts';

type MF2ParsedMessage = {
  type: 'simple' | 'match';
  pattern?: string;
  selectors?: MF2Selector[];
  variants?: MF2Variant[];
};

type MF2Selector = {
  variable: string;
  function: string | undefined;
};

type MF2Variant = {
  keys: string[];
  pattern: string;
};

// TODO: use messageformat npm package
export class MF2Parser implements IParser {
  private pluralRules: Intl.PluralRules;

  constructor(locale: string) {
    this.pluralRules = new Intl.PluralRules(locale);
  }

  public parse(message: string, values: Record<string, unknown> = {}): string {
    const trimmed = message.trim();

    if (trimmed.startsWith('.match')) {
      return this.parseMatch(trimmed, values);
    }

    return this.interpolate(trimmed, values);
  }

  private parseMatch(message: string, values: Record<string, unknown>): string {
    const parsed = this.parseMatchSyntax(message);
    if (!parsed.selectors || !parsed.variants) {
      return message;
    }

    const selectedVariant = this.selectVariant(
      parsed.selectors,
      parsed.variants,
      values
    );

    return this.interpolate(selectedVariant, values);
  }

  private parseMatchSyntax(message: string): MF2ParsedMessage {
    const lines = message
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0 || !lines[0]?.startsWith('.match')) {
      return { type: 'simple', pattern: message };
    }

    const matchLine = lines[0];
    const selectors = this.parseSelectors(matchLine);
    const variants = this.parseVariants(lines.slice(1));

    return {
      type: 'match',
      selectors,
      variants,
    };
  }

  private parseSelectors(matchLine: string): MF2Selector[] {
    const selectors: MF2Selector[] = [];
    const selectorRegex = /\{\s*\$(\w+)(?:\s+:(\w+))?\s*\}/g;

    let match;
    while ((match = selectorRegex.exec(matchLine)) !== null) {
      const [, variable, fn] = match;
      if (!variable) continue;

      selectors.push({
        variable,
        function: fn,
      });
    }

    return selectors;
  }

  private parseVariants(lines: string[]): MF2Variant[] {
    const variants: MF2Variant[] = [];
    const variantRegex = /^([\w\s*]+)\s*\{\{(.+?)\}\}$/;

    for (const line of lines) {
      const match = variantRegex.exec(line);
      if (!match) continue;

      const [, keys, pattern] = match;
      if (!keys || !pattern) continue;

      const normalizedKeys = keys.trim().split(/\s+/);
      const normalizedPattern = pattern.trim();
      variants.push({ keys: normalizedKeys, pattern: normalizedPattern });
    }

    return variants;
  }

  private selectVariant(
    selectors: MF2Selector[],
    variants: MF2Variant[],
    values: Record<string, unknown>
  ): string {
    const resolvedKeys = selectors.map((selector) => {
      const value = values[selector.variable];

      if (selector.function === 'number' && typeof value === 'number') {
        return this.pluralRules.select(value);
      }

      return String(value ?? '*');
    });

    for (const variant of variants) {
      if (this.matchesVariant(variant.keys, resolvedKeys)) {
        return variant.pattern;
      }
    }

    const fallback = variants.find((variant) =>
      variant.keys.every((key) => key === '*')
    );

    return fallback?.pattern ?? '';
  }

  private matchesVariant(
    variantKeys: string[],
    resolvedKeys: string[]
  ): boolean {
    if (variantKeys.length !== resolvedKeys.length) return false;

    return variantKeys.every((key, index) => {
      return key === '*' || key === resolvedKeys[index];
    });
  }

  private interpolate(
    pattern: string,
    values: Record<string, unknown>
  ): string {
    const regex = /\{\s*\$(\w+)\s*\}/g;

    return pattern.replace(regex, (_, key: string) => {
      const value = values[key];

      return value !== undefined ? String(value) : `{$${key}}`;
    });
  }
}
