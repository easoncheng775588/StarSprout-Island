import { act } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

describe('Level completion flow', () => {
  let completionResponse: {
    levelCode: string;
    reward: {
      stars: number;
      badgeName: string;
    };
    message: string;
    isFirstCompletion: boolean;
    effectiveStars: number;
    totalStars: number;
    newlyUnlockedBadges: Array<{
      code: string;
      title: string;
      description: string;
      progressText: string;
      unlocked: boolean;
      category: string;
      rarityLabel: string;
      progressPercent: number;
      encouragement: string;
    }>;
    leaderboardFeedback: {
      boardTitle: string;
      rankBefore: number;
      rankAfter: number;
      trendLabel: string;
      message: string;
      totalStars: number;
    };
  };

  beforeEach(() => {
    completionResponse = {
      levelCode: 'math-numbers-001',
      reward: {
        stars: 3,
        badgeName: '数字小达人'
      },
      message: 'perfect',
      isFirstCompletion: true,
      effectiveStars: 3,
      totalStars: 129,
      newlyUnlockedBadges: [],
      leaderboardFeedback: {
        boardTitle: '本周星星榜',
        rankBefore: 5,
        rankAfter: 3,
        trendLabel: '上升 2 名',
        message: '星光榜更新啦，排名上升到第 3 名。',
        totalStars: 129
      }
    };

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (url.endsWith('/api/levels/math-numbers-001') && !init?.method) {
          return {
            ok: true,
            json: async () => ({
              code: 'math-numbers-001',
              title: '数字小探险',
              subjectTitle: '数学岛',
              description: '拖一拖、选一选，把数字和数量变成好朋友。',
              steps: [
                { id: 'step-1', type: 'drag-match', prompt: '把 5 个苹果拖进篮子' },
                { id: 'step-2', type: 'tap-choice', prompt: '找到写着 5 的数字石牌' }
              ],
              reward: {
                stars: 3,
                badgeName: '数字小达人'
              }
            })
          } as Response;
        }

        if (url.endsWith('/api/levels/math-numbers-001/complete') && init?.method === 'POST') {
          return {
            ok: true,
            json: async () => completionResponse
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('submits a completed level and shows reward feedback', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-numbers-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '播放动画解读' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '播放动画解读' }));
    expect(screen.getByLabelText('动画解读视频')).toBeInTheDocument();
    expect(screen.getByText('第一幕：先看见数量')).toBeInTheDocument();
    expect(screen.getByText('第二幕：把数量放进篮子')).toBeInTheDocument();
    expect(screen.getByText('第三幕：找到对应数字')).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: '苹果 1' })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /苹果 \d/ })).toHaveLength(5);
    expect(screen.getByLabelText('苹果篮子')).toBeInTheDocument();
    expect(screen.getByAltText('篮子图片')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '数字石牌 5' })).toBeInTheDocument();

    const button = screen.getByRole('button', { name: '完成本关' });
    expect(button).toBeDisabled();

    await user.click(screen.getByRole('button', { name: '苹果 1' }));
    await user.click(screen.getByRole('button', { name: '苹果 2' }));
    await user.click(screen.getByRole('button', { name: '苹果 3' }));
    await user.click(screen.getByRole('button', { name: '苹果 4' }));
    await user.click(screen.getByRole('button', { name: '苹果 5' }));

    expect(screen.getByText('篮子里已经有 5 个苹果啦')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '数字石牌 5' }));
    expect(screen.getByText('找对了，数字 5 已经点亮')).toBeInTheDocument();
    expect(button).toBeEnabled();

    await user.click(button);

    expect(await screen.findByText('获得 3 颗星星')).toBeInTheDocument();
    expect(screen.getByText('数字小达人')).toBeInTheDocument();
    expect(screen.getByText('太棒啦，继续去点亮下一关')).toBeInTheDocument();
    expect(screen.getByText('下一关已解锁')).toBeInTheDocument();
    expect(screen.getByText('本周星星榜')).toBeInTheDocument();
    expect(screen.getByText('上升 2 名')).toBeInTheDocument();
    expect(screen.getByText('星光榜更新啦，排名上升到第 3 名。')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '前往下一关' })).toHaveAttribute('href', '/levels/math-numbers-002');
    expect(screen.getByLabelText('通关庆祝动画')).toBeInTheDocument();
    expect(screen.getAllByLabelText('庆祝星星')).toHaveLength(6);
    expect(screen.queryByLabelText('下一关提示箭头')).not.toBeInTheDocument();

    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 1600));
    });

    expect(screen.getByLabelText('下一关提示箭头')).toBeInTheDocument();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/levels/math-numbers-001/complete',
      expect.objectContaining({ method: 'POST' })
    );
  }, 8000);

  test('shows repeat-practice feedback without re-granting first-pass stars', async () => {
    completionResponse = {
      levelCode: 'math-numbers-001',
      reward: {
        stars: 3,
        badgeName: '数字小达人'
      },
      message: 'perfect',
      isFirstCompletion: false,
      effectiveStars: 0,
      totalStars: 129,
      newlyUnlockedBadges: [],
      leaderboardFeedback: {
        boardTitle: '本周星星榜',
        rankBefore: 3,
        rankAfter: 3,
        trendLabel: '稳定第 3 名',
        message: '复习完成，星光榜排名保持第 3 名。',
        totalStars: 129
      }
    };

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-numbers-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '苹果 1' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '苹果 1' }));
    await user.click(screen.getByRole('button', { name: '苹果 2' }));
    await user.click(screen.getByRole('button', { name: '苹果 3' }));
    await user.click(screen.getByRole('button', { name: '苹果 4' }));
    await user.click(screen.getByRole('button', { name: '苹果 5' }));
    await user.click(screen.getByRole('button', { name: '数字石牌 5' }));
    await user.click(screen.getByRole('button', { name: '完成本关' }));

    expect(await screen.findByText('这次是复习练习，星星奖励已在首通时发放')).toBeInTheDocument();
    expect(screen.getByText('累计星星 129 颗')).toBeInTheDocument();
  });

  test('celebrates newly unlocked achievements separately from normal reward state', async () => {
    completionResponse = {
      levelCode: 'math-numbers-001',
      reward: {
        stars: 3,
        badgeName: '数字小达人'
      },
      message: 'perfect',
      isFirstCompletion: true,
      effectiveStars: 3,
      totalStars: 129,
      leaderboardFeedback: {
        boardTitle: '本周星星榜',
        rankBefore: 5,
        rankAfter: 3,
        trendLabel: '上升 2 名',
        message: '星光榜更新啦，排名上升到第 3 名。',
        totalStars: 129
      },
      newlyUnlockedBadges: [
        {
          code: 'weekly_champion',
          title: '本周小冠军',
          description: '7 天内完成 6 次挑战',
          progressText: '已解锁',
          unlocked: true,
          category: '每周挑战',
          rarityLabel: '闪亮徽章',
          progressPercent: 100,
          encouragement: '已经点亮，继续保持这份节奏'
        }
      ]
    };

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={['/levels/math-numbers-001']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByRole('button', { name: '苹果 1' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '苹果 1' }));
    await user.click(screen.getByRole('button', { name: '苹果 2' }));
    await user.click(screen.getByRole('button', { name: '苹果 3' }));
    await user.click(screen.getByRole('button', { name: '苹果 4' }));
    await user.click(screen.getByRole('button', { name: '苹果 5' }));
    await user.click(screen.getByRole('button', { name: '数字石牌 5' }));
    await user.click(screen.getByRole('button', { name: '完成本关' }));

    expect(await screen.findByText('新成就解锁')).toBeInTheDocument();
    expect(screen.getByText('本周小冠军')).toBeInTheDocument();
    expect(screen.getByText('7 天内完成 6 次挑战')).toBeInTheDocument();
  });
});
