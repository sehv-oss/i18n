import * as React from 'react';
import type { I18nPart, TranslateArgs, TranslationKey } from '@sehv-oss/i18n';

import { useI18nContext } from '../context.ts';

/**
 * Renderers for the markup placeholders in a message, keyed by the name the message uses:
 * `{#link}…{/link}` looks up `link`.
 *
 * `chunks` is everything between the opening and closing placeholder, already rendered.
 * A standalone placeholder such as `{#br /}` calls its renderer with `null`.
 */
export type RichTags = Record<
  string,
  (chunks: React.ReactNode) => React.ReactNode
>;

/**
 * The function {@link useRichTranslate} returns.
 *
 * Named for the same reason `TranslateFn` is: an inferred return type would resolve `TranslateArgs`
 * against this package's own empty `Register` during declaration emit, and consumers would lose
 * parameter checking.
 */
export type RichTranslateFn = <TKey extends TranslationKey>(
  key: TKey,
  values?: TranslateArgs<TKey>[0],
  tags?: RichTags
) => React.ReactNode;

/**
 * Returns a translate function that renders markup placeholders as React nodes.
 *
 * Use it when a message contains a link, a bold run, or anything else that has to become an element —
 * the alternative is splitting one sentence across three keys and losing the word order in every
 * language that reorders it. A placeholder with no matching entry in `tags` still renders its text.
 *
 * @returns A translate function taking the key, the message values, and the tag renderers.
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const richTranslate = useRichTranslate();
 *
 * // "Accept the {#link}terms{/link}"
 * return (
 *   <p>
 *     {richTranslate('terms', undefined, {
 *       link: (chunks) => <a href="/terms">{chunks}</a>,
 *     })}
 *   </p>
 * );
 * ```
 */
export function useRichTranslate(): RichTranslateFn {
  const { i18n } = useI18nContext();

  return React.useCallback<RichTranslateFn>(
    (key, values, tags) => {
      const parts = i18n.translateToParts(
        key,
        ...([values] as TranslateArgs<typeof key>)
      );

      const [nodes] = buildNodes(parts, 0, tags ?? {});

      return toNode(nodes);
    },
    [i18n]
  );
}

function buildNodes(
  parts: I18nPart[],
  start: number,
  tags: RichTags
): [React.ReactNode[], number] {
  const nodes: React.ReactNode[] = [];
  let cursor = start;

  while (cursor < parts.length) {
    const part = parts[cursor];
    if (!part) break;

    if (part.type === 'text') {
      nodes.push(part.value);
      cursor++;
      continue;
    }

    if (part.kind === 'close') {
      return [nodes, cursor + 1];
    }

    const renderTag = tags[part.name];

    if (part.kind === 'standalone') {
      nodes.push(renderTag ? renderTag(null) : null);
      cursor++;
      continue;
    }

    const [children, next] = buildNodes(parts, cursor + 1, tags);
    const wrapped = toNode(children);

    nodes.push(renderTag ? renderTag(wrapped) : wrapped);
    cursor = next;
  }

  return [nodes, cursor];
}

function toNode(nodes: React.ReactNode[]): React.ReactNode {
  if (nodes.length === 0) return null;
  if (nodes.length === 1) return nodes[0];

  return nodes.map((node, index) => (
    <React.Fragment key={index}>{node}</React.Fragment>
  ));
}
