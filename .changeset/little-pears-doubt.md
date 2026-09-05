---
"@sehv-oss/i18n": major
"@sehv-oss/i18n-react": major
---

feat: add display name and duration formatters

Add `formatDisplayName` (`Intl.DisplayNames`) — the name of a language, region, script or currency written in the current locale, which is what a language switcher needs — and `formatDuration` (`Intl.DurationFormat`). Both ship with standalone `FormatDisplayName` / `FormatDuration` classes on `@sehv-oss/i18n/formatters`, and with `useFormatDisplayName` / `useFormatDuration` hooks and `<FormatDisplayName>` / `<FormatDuration>` components in the React package.

`Intl.DurationFormat` is newer than the rest of the `Intl` API — feature-detect it on clients you do not control.
