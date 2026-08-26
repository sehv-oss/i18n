import { expectTypeOf, test } from 'vitest';
import type { MessageParams } from '../../src/messages/values.types.ts';

test('should extract a simple placeholder', () => {
  expectTypeOf<MessageParams<'Hello, {$name}!'>>().toEqualTypeOf<'name'>();
});

test('should extract multiple placeholders', () => {
  expectTypeOf<MessageParams<'{$greeting}, {$name}!'>>().toEqualTypeOf<
    'greeting' | 'name'
  >();
});

test('should drop the function annotation', () => {
  expectTypeOf<
    MessageParams<'.input {$count :number}\n.match $count\none {{One}}\n* {{Many}}'>
  >().toEqualTypeOf<'count'>();
});

test('should keep only the head segment of a path placeholder', () => {
  expectTypeOf<MessageParams<'Hi {$user.name}'>>().toEqualTypeOf<'user'>();
});

test('should ignore escaped braces', () => {
  expectTypeOf<
    MessageParams<'Literal \\{$notAVar\\}'>
  >().toEqualTypeOf<never>();
});

test('should exclude local declarations', () => {
  expectTypeOf<
    MessageParams<'.local $total = {$count :number}\n{{Total: {$total}}}'>
  >().toEqualTypeOf<'count'>();
});

test('should resolve never for a message without placeholders', () => {
  expectTypeOf<MessageParams<'Simple message'>>().toEqualTypeOf<never>();
});

test('should resolve never for a widened string, as JSON imports produce', () => {
  expectTypeOf<MessageParams<string>>().toEqualTypeOf<never>();
});
