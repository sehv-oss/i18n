# Exemplos

Exemplos de uso da biblioteca `@sehv-oss/i18n`.

## Pré-requisitos

```bash
# Na raiz do monorepo
pnpm install
pnpm build
```

## Exemplos disponíveis

| Exemplo                                              | Descrição                                           |
| ---------------------------------------------------- | --------------------------------------------------- |
| [usando-o-core](./usando-o-core)                     | Uso básico do core com vanilla JS/TS                |
| [criando-um-loader-de-yaml](./criando-um-loader-de-yaml) | Como criar um loader customizado para arquivos YAML |
| [usando-react](./usando-react)                       | Integração com React (hooks e components)           |

## Como rodar

Cada exemplo é um projeto Vite independente. Para rodar:

```bash
# A partir da raiz do monorepo
cd exemplos/<nome-do-exemplo>
pnpm dev
```

Ou usando o filtro do pnpm:

```bash
pnpm --filter exemplo-usando-o-core dev
pnpm --filter exemplo-criando-um-loader-de-yaml dev
pnpm --filter exemplo-usando-react dev
```
