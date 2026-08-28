import { useI18nContext } from '../context.ts';

/**
 * The i18n instance from the nearest {@link I18nProvider}.
 *
 * The escape hatch for anything the dedicated hooks do not cover — loading messages, reading `getLocales`, subscribing by hand.
 *
 * @throws If no {@link I18nProvider} is mounted above the caller.
 *
 * @example
 * ```tsx
 * const i18n = useI18n();
 *
 * React.useEffect(() => {
 *   void i18n.loadMessagesAsync('pt-BR', '/locales/pt-BR.json');
 * }, [i18n]);
 * ```
 */
export function useI18n() {
  const { i18n } = useI18nContext();

  return i18n;
}
