import { expect, test } from 'vitest';
import { MessagesManager } from '../../src/messages/messages.ts';

test('should store and retrieve messages by locale', () => {
  const manager = new MessagesManager();

  manager.set('en', { greeting: 'Hello' });
  const messages = manager.get('en');

  expect(messages).toEqual({ greeting: 'Hello' });
});

test('should return undefined for non-existent locale', () => {
  const manager = new MessagesManager();

  const messages = manager.get('en');

  expect(messages).toBeUndefined();
});

test('should check if locale exists', () => {
  const manager = new MessagesManager();

  manager.set('en', { greeting: 'Hello' });
  const hasEn = manager.has('en');
  const hasFr = manager.has('fr');

  expect(hasEn).toBe(true);
  expect(hasFr).toBe(false);
});

test('should return all available locales', () => {
  const manager = new MessagesManager();

  manager.set('en', { greeting: 'Hello' });
  manager.set('fr', { greeting: 'Bonjour' });
  const locales = manager.getLocales();

  expect(locales).toEqual(['en', 'fr']);
});

test('should get a specific message by key', () => {
  const manager = new MessagesManager();

  manager.set('en', { greeting: 'Hello', farewell: 'Goodbye' });
  const greeting = manager.getMessage('en', 'greeting');
  const farewell = manager.getMessage('en', 'farewell');

  expect(greeting).toBe('Hello');
  expect(farewell).toBe('Goodbye');
});

test('should return undefined for non-existent message key', () => {
  const manager = new MessagesManager();

  manager.set('en', { greeting: 'Hello' });
  const nonexistent = manager.getMessage('en', 'nonexistent');

  expect(nonexistent).toBeUndefined();
});

test('should return undefined for non-existent locale when getting message', () => {
  const manager = new MessagesManager();

  const nonexistent = manager.getMessage('en', 'greeting');

  expect(nonexistent).toBeUndefined();
});

test('should get a nested message by dot path', () => {
  const manager = new MessagesManager();

  manager.set('en', {
    home: { title: 'Home', nav: { back: 'Back' } },
  });
  const title = manager.getMessage('en', 'home.title');
  const back = manager.getMessage('en', 'home.nav.back');

  expect(title).toBe('Home');
  expect(back).toBe('Back');
});

test('should prefer a flat key containing dots over the nested path', () => {
  const manager = new MessagesManager();

  manager.set('en', {
    'home.title': 'Flat',
    home: { title: 'Nested' },
  });
  const title = manager.getMessage('en', 'home.title');

  expect(title).toBe('Flat');
});

test('should return undefined when a dot path resolves to an object', () => {
  const manager = new MessagesManager();

  manager.set('en', { home: { title: 'Home' } });
  const home = manager.getMessage('en', 'home');

  expect(home).toBeUndefined();
});

test('should return undefined when a dot path segment is missing', () => {
  const manager = new MessagesManager();

  manager.set('en', { home: { title: 'Home' } });
  const missing = manager.getMessage('en', 'home.missing.deep');

  expect(missing).toBeUndefined();
});
