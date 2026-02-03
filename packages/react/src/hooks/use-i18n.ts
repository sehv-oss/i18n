import { useI18nContext } from '../context.ts';

export function useI18n() {
  const { i18n } = useI18nContext();

  return i18n;
}
