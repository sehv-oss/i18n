import { expectTypeOf, test } from 'vitest';
import { Translate, useTranslate } from '@sehv-oss/i18n-react';

const messages = {
  greeting: 'Hello, {$name}!',
  home: { title: 'Home' },
} as const;

declare module '@sehv-oss/i18n' {
  interface Register {
    messages: typeof messages;
  }
}

test('should type the hook without threading a generic', () => {
  const translate = useTranslate();

  expectTypeOf(translate('home.title')).toBeString();
  expectTypeOf(translate('greeting', { name: 'World' })).toBeString();

  // @ts-expect-error misspelled key
  translate('greetng', { name: 'World' });

  // @ts-expect-error the message declares $name
  translate('greeting');
});

test('should type the component props', () => {
  expectTypeOf(<Translate id="home.title" />).not.toBeNever();
  expectTypeOf(
    <Translate id="greeting" values={{ name: 'World' }} />
  ).not.toBeNever();

  // @ts-expect-error misspelled key
  expectTypeOf(<Translate id="greetng" values={{ name: 'World' }} />);

  // @ts-expect-error 'greeting' declares $name, so values is required
  expectTypeOf(<Translate id="greeting" />);
});
