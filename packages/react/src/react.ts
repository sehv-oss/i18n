/**
 * React bindings for `@sehv-oss/i18n`: a provider, hooks and components that read one shared i18n instance and re-render on locale changes.
 *
 * Type safety is inherited, not configured — augment `Register` once in the core package and every hook and component here picks it up.
 * There is no generic to thread and no factory to call.
 *
 * @packageDocumentation
 */

export * from './components/components.ts';
export * from './hooks/hooks.ts';
export * from './context.ts';
export * from './provider.tsx';
