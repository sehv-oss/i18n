# Exemplos

Exemplos de uso da biblioteca `@sehv-oss/i18n`.

## Pré-requisitos

```bash
# Na raiz do monorepo
pnpm install
pnpm build
```

## Exemplos disponíveis

| Exemplo                                                  | Descrição                                           |
| -------------------------------------------------------- | --------------------------------------------------- |
| [usando-o-core](./usando-o-core)                         | Uso básico do core com vanilla JS/TS                |
| [criando-um-loader-de-yaml](./criando-um-loader-de-yaml) | Como criar um loader customizado para arquivos YAML |
| [usando-react](./usando-react)                           | Integração com React (hooks e components)           |

## Como rodar

Todos os exemplos rodam em um único projeto Vite com multi-page.
Um único `pnpm dev` sobe a landing page com navegação entre os exemplos:

```bash
cd exemplos
pnpm dev
```

Ou a partir da raiz do monorepo:

```bash
pnpm --filter exemplos dev
```

A landing page exibe uma sidebar com todos os exemplos disponíveis. Cada exemplo é carregado via iframe, sem necessidade de rodar servidores separados.
