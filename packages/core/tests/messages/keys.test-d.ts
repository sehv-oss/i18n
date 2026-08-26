import { expectTypeOf, test } from 'vitest';
import type { MessageAt, MessageKey } from '../../src/messages/keys.types.ts';

type Sample = {
  greeting: string;
  home: {
    title: string;
    nav: { back: string };
  };
};

test('should flatten nested messages into dot paths', () => {
  expectTypeOf<MessageKey<Sample>>().toEqualTypeOf<
    'greeting' | 'home.title' | 'home.nav.back'
  >();
});

test('should widen to string for an index-signature dictionary', () => {
  expectTypeOf<MessageKey<Record<string, string>>>().toEqualTypeOf<string>();
});

test('should resolve the message sitting at a dot path', () => {
  expectTypeOf<MessageAt<Sample, 'home.nav.back'>>().toEqualTypeOf<string>();
});

test('should resolve never for an unknown path', () => {
  expectTypeOf<MessageAt<Sample, 'home.missing'>>().toEqualTypeOf<never>();
});
