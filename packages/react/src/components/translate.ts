import { useTranslate } from '../hooks/use-translate.ts';

export type TranslateProps = {
  id: string;
  values?: Record<string, unknown>;
};

export function Translate(props: TranslateProps) {
  const { id, values } = props;

  const translate = useTranslate();

  return translate(id, values);
}
