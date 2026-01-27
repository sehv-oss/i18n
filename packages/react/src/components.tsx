import type { ReactNode } from 'react';
import type {
  FormatNumberOptions,
  FormatCurrencyOptions,
  FormatDateOptions,
  FormatListOptions,
  FormatRelativeTimeOptions,
  RelativeTimeUnit,
} from '@sehv-oss/i18n';
import {
  useTranslate,
  useFormatNumber,
  useFormatCurrency,
  useFormatDate,
  useFormatList,
  useFormatRelativeTime,
} from './hooks.ts';

export interface TransProps {
  id: string;
  values?: Record<string, unknown>;
}

export function Trans({ id, values }: TransProps): ReactNode {
  const translate = useTranslate();
  return translate(id, values);
}

export interface FormatNumberProps extends FormatNumberOptions {
  value: number;
}

export function FormatNumber({
  value,
  ...options
}: FormatNumberProps): ReactNode {
  const formatNumber = useFormatNumber();
  return formatNumber(value, options);
}

export interface FormatCurrencyProps extends FormatCurrencyOptions {
  value: number;
  currency: string;
}

export function FormatCurrency({
  value,
  currency,
  ...options
}: FormatCurrencyProps): ReactNode {
  const formatCurrency = useFormatCurrency();
  return formatCurrency(value, currency, options);
}

export interface FormatDateProps extends FormatDateOptions {
  value: Date | number;
}

export function FormatDate({ value, ...options }: FormatDateProps): ReactNode {
  const formatDate = useFormatDate();
  return formatDate(value, options);
}

export interface FormatListProps extends FormatListOptions {
  values: string[];
}

export function FormatList({ values, ...options }: FormatListProps): ReactNode {
  const formatList = useFormatList();
  return formatList(values, options);
}

export interface FormatRelativeTimeProps extends FormatRelativeTimeOptions {
  value: number;
  unit: RelativeTimeUnit;
}

export function FormatRelativeTime({
  value,
  unit,
  ...options
}: FormatRelativeTimeProps): ReactNode {
  const formatRelativeTime = useFormatRelativeTime();
  return formatRelativeTime(value, unit, options);
}
