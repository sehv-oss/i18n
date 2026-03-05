import * as React from 'react';
import type { BundledLanguage } from 'shiki';

import { useHighlightedCode } from '../hooks/use-highlighted-code.ts';

type CodeBlockProps = {
  code: string;
  lang: BundledLanguage;
  filename?: string;
};

export function CodeBlock(props: CodeBlockProps): React.ReactElement {
  const { code, lang, filename } = props;

  const html = useHighlightedCode(code, lang);

  return (
    <div className="rounded-lg sm:rounded-xl overflow-hidden border border-zinc-800 bg-[#0d1117] min-w-0">
      {filename && (
        <div className="px-3 sm:px-4 py-1.5 sm:py-2 border-b border-zinc-800 text-[11px] sm:text-xs font-mono text-zinc-400">
          {filename}
        </div>
      )}
      <div
        className="p-3 sm:p-4 overflow-x-auto text-[11px] sm:text-sm font-mono [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!text-[inherit]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
