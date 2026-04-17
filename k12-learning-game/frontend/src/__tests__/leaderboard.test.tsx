import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { Leaderboard } from '../pages/Leaderboard';

describe('Leaderboard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('renders board tabs, my rank and nearby players', () => {
    render(
      <MemoryRouter>
        <Leaderboard
          data={{
            boardType: 'weekly_star',
            boardTitle: '本周星星榜',
            metricUnit: '颗星',
            participationEnabled: true,
            settlementWindowLabel: '结算周期：近 7 天',
            updatedAtLabel: '刚刚更新',
            nextTargetText: '距离第 5 名还差 65 颗星',
            myRank: { rank: 6, nickname: '小星星', stars: 126, trendLabel: '本周上升 2 名' },
            topPlayers: [
              { rank: 1, nickname: '小海豚', stars: 228, trendLabel: '保持领先' },
              { rank: 2, nickname: '小火箭', stars: 215, trendLabel: '本周上升 1 名' }
            ],
            nearbyPlayers: [
              { rank: 5, nickname: '小松果', stars: 191, trendLabel: '就在你前面' },
              { rank: 6, nickname: '小星星', stars: 126, trendLabel: '继续加油' },
              { rank: 7, nickname: '小月亮', stars: 120, trendLabel: '和你很接近' }
            ],
            privacyTip: '排行榜默认匿名展示，家长可随时关闭参与。'
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '本周星星榜' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
    expect(screen.getByText('我的排名')).toBeInTheDocument();
    expect(screen.getByText(/#1 小海豚/)).toBeInTheDocument();
    expect(screen.getByText(/#6 小星星/)).toBeInTheDocument();
    expect(screen.getByText('228 颗星')).toBeInTheDocument();
    expect(screen.getByText('结算周期：近 7 天')).toBeInTheDocument();
    expect(screen.getByText('距离第 5 名还差 65 颗星')).toBeInTheDocument();
    expect(screen.getByText('排行榜默认匿名展示，家长可随时关闭参与。')).toBeInTheDocument();
  });

  test('switches between real leaderboard boards', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        const payloads: Record<string, unknown> = {
          '/api/leaderboard/weekly_star': {
            boardType: 'weekly_star',
            boardTitle: '本周星星榜',
            metricUnit: '颗星',
            participationEnabled: true,
            settlementWindowLabel: '结算周期：近 7 天',
            updatedAtLabel: '刚刚更新',
            nextTargetText: '距离第 5 名还差 65 颗星',
            myRank: { rank: 6, nickname: '小星星', stars: 126, trendLabel: '本周上升 2 名' },
            topPlayers: [{ rank: 1, nickname: '小海豚', stars: 228, trendLabel: '保持领先' }],
            nearbyPlayers: [{ rank: 6, nickname: '小星星', stars: 126, trendLabel: '继续加油' }],
            privacyTip: '排行榜默认匿名展示，家长可随时关闭参与。'
          },
          '/api/leaderboard/streak_master': {
            boardType: 'streak_master',
            boardTitle: '连续学习榜',
            metricUnit: '天',
            participationEnabled: true,
            settlementWindowLabel: '结算周期：连续打卡天数',
            updatedAtLabel: '刚刚更新',
            nextTargetText: '距离第 2 名还差 7 天',
            myRank: { rank: 3, nickname: '小星星', stars: 14, trendLabel: '已经连续学习 14 天' },
            topPlayers: [{ rank: 1, nickname: '小火箭', stars: 21, trendLabel: '连续 21 天' }],
            nearbyPlayers: [{ rank: 3, nickname: '小星星', stars: 14, trendLabel: '继续坚持' }],
            privacyTip: '连续学习榜只展示坚持天数，不展示作答内容。'
          },
          '/api/leaderboard/challenge_hero': {
            boardType: 'challenge_hero',
            boardTitle: '挑战达人榜',
            metricUnit: '次挑战',
            participationEnabled: true,
            settlementWindowLabel: '结算周期：近 7 天',
            updatedAtLabel: '刚刚更新',
            nextTargetText: '距离第 3 名还差 1 次挑战',
            myRank: { rank: 4, nickname: '小星星', stars: 9, trendLabel: '本周完成 9 次挑战' },
            topPlayers: [{ rank: 1, nickname: '小鲸鱼', stars: 15, trendLabel: '挑战节奏很稳' }],
            nearbyPlayers: [{ rank: 4, nickname: '小星星', stars: 9, trendLabel: '再来 1 次就进前三' }],
            privacyTip: '挑战达人榜鼓励多尝试，不强调一次全对。'
          }
        };

        const matched = payloads[url];
        if (!matched) {
          throw new Error(`Unhandled fetch: ${url}`);
        }

        return {
          ok: true,
          json: async () => matched
        } as Response;
      })
    );

    render(
      <MemoryRouter>
        <Leaderboard />
      </MemoryRouter>
    );

    expect(await screen.findByRole('heading', { name: '本周星星榜' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '连续学习榜' }));
    expect(await screen.findByRole('heading', { name: '连续学习榜' })).toBeInTheDocument();
    expect(screen.getByText(/已经连续学习 14 天/)).toBeInTheDocument();
    expect(screen.getByText('21 天')).toBeInTheDocument();
    expect(screen.getByText('距离第 2 名还差 7 天')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '挑战达人榜' }));
    expect(await screen.findByRole('heading', { name: '挑战达人榜' })).toBeInTheDocument();
    expect(screen.getByText(/本周完成 9 次挑战/)).toBeInTheDocument();
    expect(screen.getByText('15 次挑战')).toBeInTheDocument();
    expect(screen.getByText('距离第 3 名还差 1 次挑战')).toBeInTheDocument();
  });

  test('shows non-participation state when leaderboard is disabled by parent', () => {
    render(
      <MemoryRouter>
        <Leaderboard
          data={{
            boardType: 'weekly_star',
            boardTitle: '本周星星榜',
            metricUnit: '颗星',
            participationEnabled: false,
            settlementWindowLabel: '结算周期：近 7 天',
            updatedAtLabel: '刚刚更新',
            nextTargetText: '当前孩子未参与榜单展示',
            myRank: { rank: 0, nickname: '小星星', stars: 0, trendLabel: '未参与排行榜' },
            topPlayers: [
              { rank: 1, nickname: '小海豚', stars: 228, trendLabel: '保持领先' }
            ],
            nearbyPlayers: [],
            privacyTip: '排行榜默认匿名展示，家长可随时关闭参与。'
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('未参与排行榜')).toBeInTheDocument();
    expect(screen.getByText('当前孩子未参与榜单展示')).toBeInTheDocument();
  });
});
