import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

export function useHighlightedCode(code: string, lang: string = 'typescript') {
  const [html, setHtml] = useState('');

  useEffect(() => {
    codeToHtml(code.trim(), {
      lang,
      theme: 'github-dark-default',
    }).then(setHtml);
  }, [code, lang]);

  return html;
}
