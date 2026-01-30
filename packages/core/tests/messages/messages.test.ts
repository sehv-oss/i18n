import { describe, it, expect } from 'vitest';
import { MessagesManager } from '../../src/messages/messages.ts';

describe('MessagesManager', () => {
  it('should store and retrieve messages by locale', () => {
    const manager = new MessagesManager();

    manager.set('en', { greeting: 'Hello' });
    const messages = manager.get('en');

    expect(messages).toEqual({ greeting: 'Hello' });
  });

  it('should return undefined for non-existent locale', () => {
    const manager = new MessagesManager();

    const messages = manager.get('en');

    expect(messages).toBeUndefined();
  });

  it('should check if locale exists', () => {
    const manager = new MessagesManager();

    manager.set('en', { greeting: 'Hello' });
    const hasEn = manager.has('en');
    const hasFr = manager.has('fr');

    expect(hasEn).toBe(true);
    expect(hasFr).toBe(false);
  });

  it('should return all available locales', () => {
    const manager = new MessagesManager();

    manager.set('en', { greeting: 'Hello' });
    manager.set('fr', { greeting: 'Bonjour' });
    const locales = manager.getLocales();

    expect(locales).toEqual(['en', 'fr']);
  });

  it('should get a specific message by key', () => {
    const manager = new MessagesManager();

    manager.set('en', { greeting: 'Hello', farewell: 'Goodbye' });
    const greeting = manager.getMessage('en', 'greeting');
    const farewell = manager.getMessage('en', 'farewell');

    expect(greeting).toBe('Hello');
    expect(farewell).toBe('Goodbye');
  });

  it('should return undefined for non-existent message key', () => {
    const manager = new MessagesManager();

    manager.set('en', { greeting: 'Hello' });
    const nonexistent = manager.getMessage('en', 'nonexistent');

    expect(nonexistent).toBeUndefined();
  });

  it('should return undefined for non-existent locale when getting message', () => {
    const manager = new MessagesManager();

    const nonexistent = manager.getMessage('en', 'greeting');

    expect(nonexistent).toBeUndefined();
  });
});
