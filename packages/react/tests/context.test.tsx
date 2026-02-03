import { expect, test } from 'vitest';
import { renderHook } from 'vitest-browser-react';

import { useI18nContext } from '../src/context.ts';

test('should throw error when used outside provider', async () => {
  await expect(async () => {
    await renderHook(() => useI18nContext());
  }).rejects.toThrow('Context not initialized.');
});
