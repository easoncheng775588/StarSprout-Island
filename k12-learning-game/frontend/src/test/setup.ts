import { afterEach, beforeEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

beforeEach(() => {
  window.localStorage.setItem(
    'k12-learning-game-session',
    JSON.stringify({
      parentAccountId: 1,
      parentDisplayName: '星星妈妈',
      childProfileId: 1,
      childNickname: '小星星',
      children: []
    })
  );
});

afterEach(() => {
  window.localStorage.clear();
  cleanup();
});
