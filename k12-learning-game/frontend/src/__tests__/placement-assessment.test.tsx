import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { PlacementAssessmentPage } from '../pages/PlacementAssessmentPage';
import { SessionProvider } from '../session';

describe('PlacementAssessmentPage', () => {
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
            streakDays: 3,
            totalStars: 126,
            title: '晨光冒险家',
            stageLabel: '幼小衔接',
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

  test('recommends a stage from a short math readiness check and applies it to the active child', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/api/parent/children/1') && init?.method === 'PATCH') {
        const payload = JSON.parse(String(init.body)) as { stageLabel: string };

        return {
          ok: true,
          json: async () => ({
            id: 1,
            nickname: '小星星',
            streakDays: 3,
            totalStars: 126,
            title: '晨光冒险家',
            stageLabel: payload.stageLabel,
            avatarColor: '#ffcf70'
          })
        } as Response;
      }

      throw new Error(`Unhandled fetch: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <SessionProvider>
          <PlacementAssessmentPage />
        </SessionProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '数学能力小测评' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '5' }));
    await user.click(screen.getByRole('button', { name: '14' }));
    await user.click(screen.getByRole('button', { name: '12' }));
    await user.click(screen.getByRole('button', { name: '长方形' }));
    await user.click(screen.getAllByRole('button', { name: '6' })[1]);

    expect(screen.getByText('推荐从一年级开始')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '应用到小星星的学习路线' }));

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/parent/children/1',
      expect.objectContaining({
        method: 'PATCH',
        body: expect.stringContaining('"stageLabel":"一年级"')
      })
    );
    expect(screen.getByText('已经把学习路线调整为一年级')).toBeInTheDocument();
  });
});
