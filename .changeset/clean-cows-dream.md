---
"@sehv-oss/i18n": major
---

feat(core)!: accept custom MF2 functions and an injectable parser

Add `functions` for custom MF2 function handlers (`{$word :shout}`), `draftFunctions: false` to leave the `messageformat` draft functions out of the bundle, and `parser` to replace the MessageFormat 2 parser entirely — the extension point `IParser` always described but nothing accepted. `IParserFactory` is exported alongside it.
