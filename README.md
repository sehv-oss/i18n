# @sehv-oss/i18n

Modern i18n library for JavaScript. Web standards based, runs everywhere.

## Features

- **Web Standards** — Built on the `Intl` API
- **MessageFormat 2.0** — LDML 48 syntax, via the reference implementation
- **Universal** — Works in browsers, Node.js, Bun, Deno
- **Type-safe** — Keys, dot paths and message placeholders checked at compile time
- **Rich text** — Links and elements inside a message, not split across three keys
- **Locale negotiation** — `pt-BR` reads from `pt`, and `Accept-Language` resolves to what you loaded
- **Extensible** — Custom loaders, custom MF2 functions, or your own parser
- **Lightweight** — One dependency, nothing transitive, tree-shakeable

## Packages

| Package                | Description    | Documentation                      |
| ---------------------- | -------------- | ---------------------------------- |
| `@sehv-oss/i18n`       | Core library   | [docs](./packages/core/README.md)  |
| `@sehv-oss/i18n-react` | React bindings | [docs](./packages/react/README.md) |

## License

ISC
