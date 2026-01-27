import type { MessageParser } from './parser.interface.ts';

interface ParsedMessage {
  type: 'simple' | 'match';
  pattern?: string;
  selectors?: Selector[];
  variants?: Variant[];
}

interface Selector {
  variable: string;
  function?: string;
}

interface Variant {
  keys: string[];
  pattern: string;
}

export class MF2Parser implements MessageParser {
  private locale: string;
  private pluralRules: Intl.PluralRules;

  constructor(locale: string) {
    this.locale = locale;
    this.pluralRules = new Intl.PluralRules(locale);
  }

  parse(message: string, values: Record<string, unknown> = {}): string {
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

  private parseMatchSyntax(message: string): ParsedMessage {
    const lines = message
      .split('\n')
      .map((l) => l.trim())
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

  private parseSelectors(matchLine: string): Selector[] {
    const selectorRegex = /\{\s*\$(\w+)(?:\s+:(\w+))?\s*\}/g;
    const selectors: Selector[] = [];
    let match;

    while ((match = selectorRegex.exec(matchLine)) !== null) {
      selectors.push({
        variable: match[1]!,
        function: match[2],
      });
    }

    return selectors;
  }

  private parseVariants(lines: string[]): Variant[] {
    const variants: Variant[] = [];
    const variantRegex = /^([\w\s*]+)\s*\{\{(.+?)\}\}$/;

    for (const line of lines) {
      const match = variantRegex.exec(line);
      if (match) {
        const keys = match[1]!.trim().split(/\s+/);
        const pattern = match[2]!.trim();
        variants.push({ keys, pattern });
      }
    }

    return variants;
  }

  private selectVariant(
    selectors: Selector[],
    variants: Variant[],
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

    const fallback = variants.find((v) => v.keys.every((k) => k === '*'));
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
    return pattern.replace(/\{\s*\$(\w+)\s*\}/g, (_, key: string) => {
      const value = values[key];
      return value !== undefined ? String(value) : `{$${key}}`;
    });
  }
}

export type { MessageParser } from './parser.interface.js';
