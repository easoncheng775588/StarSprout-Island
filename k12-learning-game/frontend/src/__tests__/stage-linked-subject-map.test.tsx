import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';
import type { SessionChildProfile } from '../api';

describe('Stage-linked subject maps', () => {
  beforeEach(() => {
    let children: SessionChildProfile[] = [
      {
        id: 1,
        nickname: '小星星',
        streakDays: 7,
        totalStars: 126,
        title: '晨光冒险家',
        stageLabel: '三年级',
        avatarColor: '#ffcf70'
      }
    ];

    window.localStorage.setItem(
      'k12-learning-game-session',
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 1,
        childNickname: '小星星',
        children
      })
    );

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (url.endsWith('/api/parent/children/1') && init?.method === 'PATCH') {
          const payload = JSON.parse(String(init.body)) as {
            nickname: string;
            title: string;
            stageLabel: string;
            avatarColor: string;
          };
          children = children.map((child) => (
            child.id === 1
              ? { ...child, stageLabel: payload.stageLabel, avatarColor: payload.avatarColor }
              : child
          ));

          return {
            ok: true,
            json: async () => children[0]
          } as Response;
        }

        if (url.endsWith('/api/subjects/math/map')) {
          const activeStage = children[0].stageLabel;

          return {
            ok: true,
            json: async () => ({
              subject: {
                code: 'math',
                title: '数学岛'
              },
              chapters: activeStage === '四年级'
                ? [
                    {
                      code: 'math-grade4-numbers',
                      title: '小数图形站',
                      subtitle: '从小数到角和图形。',
                      levels: [
                        { code: 'math-grade4-decimal-001', title: '小数初步', status: 'recommended' }
                      ]
                    }
                  ]
                : [
                    {
                      code: 'math-grade3-operations',
                      title: '除法图形站',
                      subtitle: '从平均分到周长。',
                      levels: [
                        { code: 'math-grade3-division-001', title: '除法平均分', status: 'recommended' }
                      ]
                    }
                  ]
            })
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  test('reloads the current subject map when the top grade selector changes', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/subjects/math']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('除法图形站')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('年级选择'), '四年级');

    expect(await screen.findByText('当前阶段：四年级')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('小数图形站')).toBeInTheDocument();
    });
    expect(screen.queryByText('除法图形站')).not.toBeInTheDocument();
  });
});
