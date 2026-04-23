import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { FluencyPracticePage } from '../pages/FluencyPracticePage';
import { SessionProvider } from '../session';

describe('FluencyPracticePage', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'k12-learning-game-session',
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 1,
        childNickname: '小星星',
        children: [
          {
            id: 1,
            nickname: '小星星',
            streakDays: 4,
            totalStars: 138,
            title: '晨光冒险家',
            stageLabel: '一年级',
            avatarColor: '#ffcf70'
          }
        ]
      })
    );
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  test('runs and records a short stage-aware daily math fluency practice', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/api/fluency/practice') && !init?.method) {
        return {
          ok: true,
          json: async () => ({
            stageLabel: '一年级',
            focusArea: 'addition-within-20',
            focusAreaLabel: '20 以内加减',
            questions: [
              { prompt: '3 + 4 = ?', choices: [6, 7, 8], answer: 7 },
              { prompt: '9 - 2 = ?', choices: [6, 7, 8], answer: 7 },
              { prompt: '8 + 4 = ?', choices: [11, 12, 13], answer: 12 },
              { prompt: '15 - 7 = ?', choices: [6, 8, 9], answer: 8 },
              { prompt: '6 + 9 = ?', choices: [14, 15, 16], answer: 15 }
            ]
          })
        } as Response;
      }

      if (url.endsWith('/api/fluency/attempts') && init?.method === 'POST') {
        return {
          ok: true,
          json: async () => ({
            stageLabel: '一年级',
            focusArea: 'addition-within-20',
            totalQuestions: 5,
            correctCount: 5,
            durationSeconds: 60,
            accuracyPercent: 100,
            todayAttemptCount: 1,
            encouragement: '今天已完成 1 次数感快练，正确率 100%'
          })
        } as Response;
      }

      throw new Error(`Unhandled fetch: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <SessionProvider>
          <FluencyPracticePage />
        </SessionProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '1 分钟数感快练' })).toBeInTheDocument();
    expect(screen.getByText('一年级快练')).toBeInTheDocument();
    expect(screen.getByText('3 + 4 = ?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '7' }));
    expect(screen.getByText('9 - 2 = ?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '7' }));
    await user.click(screen.getByRole('button', { name: '12' }));
    await user.click(screen.getByRole('button', { name: '8' }));
    await user.click(screen.getByRole('button', { name: '15' }));

    expect(screen.getByText('今日快练完成')).toBeInTheDocument();
    expect(screen.getByText('完成 5 题，答对 5 题')).toBeInTheDocument();
    expect(screen.getByText('小星星的数感速度正在变稳')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('今天已完成 1 次数感快练，正确率 100%')).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/fluency/attempts',
      expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"focusArea":"addition-within-20"')
      })
    );
  });

  test('falls back to local practice set when backend practice endpoint is unavailable', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/api/fluency/practice') && !init?.method) {
        return { ok: false } as Response;
      }

      if (url.endsWith('/api/fluency/attempts') && init?.method === 'POST') {
        return {
          ok: true,
          json: async () => ({
            stageLabel: '一年级',
            focusArea: 'addition-within-20',
            totalQuestions: 5,
            correctCount: 1,
            durationSeconds: 60,
            accuracyPercent: 20,
            todayAttemptCount: 1,
            encouragement: '今天已完成 1 次数感快练，正确率 20%'
          })
        } as Response;
      }

      throw new Error(`Unhandled fetch: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <SessionProvider>
          <FluencyPracticePage />
        </SessionProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('3 + 4 = ?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '7' }));

    expect(fetchMock).toHaveBeenCalledWith('/api/fluency/practice', expect.any(Object));
  });
});
