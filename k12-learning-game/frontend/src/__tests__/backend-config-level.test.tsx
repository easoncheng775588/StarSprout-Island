import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

describe('Backend configured level activities', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (url.endsWith('/api/levels/math-backend-config-001') && !init?.method) {
          return {
            ok: true,
            json: async () => ({
              code: 'math-backend-config-001',
              title: '后端配置数字关',
              subjectTitle: '数学岛',
              description: '这一关从后端题库配置玩法。',
              steps: [
                {
                  id: 'step-1',
                  type: 'tap-choice',
                  prompt: '找到后端配置的正确数字',
                  knowledgePointTitle: '100 以内数字辨认',
                  activityConfigJson: JSON.stringify({
                    kind: 'number-choice',
                    instruction: '这段说明来自后端配置，请选出 7。',
                    choices: [3, 7, 9],
                    correctChoice: 7,
                    optionLabelPrefix: '后端数字卡',
                    successFeedback: '后端配置答对啦',
                    failureFeedback: '再看看后端题目里的数字',
                    assetTheme: '卡通果园',
                    audioQuality: '高质量 TTS',
                    variantCount: 6
                  })
                }
              ],
              reward: {
                stars: 2,
                badgeName: '配置小先锋'
              }
            })
          } as Response;
        }

        if (url.endsWith('/api/levels/math-backend-config-001/complete') && init?.method === 'POST') {
          return {
            ok: true,
            json: async () => ({
              levelCode: 'math-backend-config-001',
              reward: {
                stars: 2,
                badgeName: '配置小先锋'
              },
              message: 'perfect',
              isFirstCompletion: true,
              effectiveStars: 2,
              totalStars: 131,
              newlyUnlockedBadges: []
            })
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('renders backend activity config metadata and completes the level', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-backend-config-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('这段说明来自后端配置，请选出 7。')).toBeInTheDocument();
    expect(screen.getByText('100 以内数字辨认')).toBeInTheDocument();
    expect(screen.getByText('题库变体 6 组')).toBeInTheDocument();
    expect(screen.getByText('素材风格：卡通果园')).toBeInTheDocument();
    expect(screen.getByText('音频质量：高质量 TTS')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '后端数字卡 7' }));
    expect(screen.getByText('后端配置答对啦')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '完成本关' }));

    expect(await screen.findByText('获得 2 颗星星')).toBeInTheDocument();
    expect(screen.getByText('配置小先锋')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/levels/math-backend-config-001/complete',
      expect.objectContaining({ method: 'POST' })
    );
  });
});
