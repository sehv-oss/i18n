import type { Messages } from '../messages/messages.ts';

/**
 * Turns the raw text of a message file into {@link Messages}.
 *
 * This is the extension point behind `I18nInstance.loadMessagesAsync`:
 * pass loaders through `loaders` in the config and any format becomes loadable.
 * JSON is built in and always takes precedence for `.json`.
 *
 * @example
 * ```ts
 * import { createI18n, type ILoader } from '@sehv-oss/i18n';
 * import YAML from 'yaml';
 *
 * const yamlLoader: ILoader = {
 *   extensions: ['.yaml', '.yml'],
 *   parse(content) {
 *     return YAML.parse(content);
 *   },
 * };
 *
 * const i18n = createI18n({ locale: 'en', loaders: [yamlLoader] });
 * await i18n.loadMessagesAsync('/locales/en.yaml');
 * ```
 */
export interface ILoader {
  /**
   * File extensions this loader claims, leading dot included: `['.yaml', '.yml']`. Matched against the extension of the loaded URL.
   */
  extensions: string[];

  /**
   * Parses file content into messages, flat or nested.
   *
   * Throwing is how a malformed file is reported — the error surfaces from `loadMessagesAsync` rather than being swallowed.
   */
  parse(content: string): Messages;
}
