import { useContext, useCallback } from 'react';
import type {
  FormatNumberOptions,
  FormatCurrencyOptions,
  FormatDateOptions,
  FormatListOptions,
  FormatRelativeTimeOptions,
  RelativeTimeUnit,
} from '@sehv-oss/i18n';
import { I18nContext } from './context.ts';

function useI18nContext() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useI18n() {
  const { i18n } = useI18nContext();
  return i18n;
}

export function useLocale() {
  const { locale, i18n } = useI18nContext();

  const setLocale = useCallback(
    (newLocale: string) => {
      i18n.setLocale(newLocale);
    },
    [i18n]
  );

  return [locale, setLocale] as const;
}

export function useTranslate() {
  const { i18n, locale } = useI18nContext();

  return useCallback(
    (key: string, values?: Record<string, unknown>) => {
      return i18n.translate(key, values);
    },
    [i18n, locale]
  );
}

export function useFormatNumber() {
  const { i18n, locale } = useI18nContext();

  return useCallback(
    (value: number, options?: FormatNumberOptions) => {
      return i18n.formatNumber(value, options);
    },
    [i18n, locale]
  );
}

export function useFormatCurrency() {
  const { i18n, locale } = useI18nContext();

  return useCallback(
    (value: number, currency: string, options?: FormatCurrencyOptions) => {
      return i18n.formatCurrency(value, currency, options);
    },
    [i18n, locale]
  );
}

export function useFormatDate() {
  const { i18n, locale } = useI18nContext();

  return useCallback(
    (value: Date | number, options?: FormatDateOptions) => {
      return i18n.formatDate(value, options);
    },
    [i18n, locale]
  );
}

export function useFormatList() {
  const { i18n, locale } = useI18nContext();

  return useCallback(
    (values: string[], options?: FormatListOptions) => {
      return i18n.formatList(values, options);
    },
    [i18n, locale]
  );
}

export function useFormatRelativeTime() {
  const { i18n, locale } = useI18nContext();

  return useCallback(
    (
      value: number,
      unit: RelativeTimeUnit,
      options?: FormatRelativeTimeOptions
    ) => {
      return i18n.formatRelativeTime(value, unit, options);
    },
    [i18n, locale]
  );
}
