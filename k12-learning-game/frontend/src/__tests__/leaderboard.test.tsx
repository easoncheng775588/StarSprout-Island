import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Leaderboard } from '../pages/Leaderboard';

describe('Leaderboard', () => {
  test('renders board tabs, my rank and nearby players', () => {
    render(
      <MemoryRouter>
        <Leaderboard
          data={{
            boardType: 'weekly_star',
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
    expect(screen.getByText('排行榜默认匿名展示，家长可随时关闭参与。')).toBeInTheDocument();
  });
});
