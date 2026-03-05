import { useEffect, useState } from 'react';
import { type BundledLanguage, codeToHtml } from 'shiki';

export function useHighlightedCode(
  code: string,
  lang: BundledLanguage
): string {
  const [html, setHtml] = useState('');

  useEffect(() => {
    codeToHtml(code.trim(), {
      lang,
      theme: 'github-dark-default',
    }).then(setHtml);
  }, [code, lang]);

  return html;
}
