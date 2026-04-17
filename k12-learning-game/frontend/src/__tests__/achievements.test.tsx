import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AchievementsPage } from '../pages/AchievementsPage';

describe('AchievementsPage', () => {
  test('renders unlocked and in-progress achievement badges', () => {
    render(
      <MemoryRouter>
        <AchievementsPage
          data={{
            childNickname: '小星星',
            unlockedCount: 6,
            totalCount: 10,
            unlockedBadges: [
              {
                code: 'math_starter',
                title: '数字小达人',
                description: '完成第一组数字启蒙关卡',
                progressText: '已解锁',
                unlocked: true,
                category: '数学启蒙',
                rarityLabel: '成长徽章',
                progressPercent: 100,
                encouragement: '数字朋友已经很熟悉你啦'
              },
              {
                code: 'phonics_listener',
                title: '拼音小耳朵',
                description: '完成拼音泡泡练习',
                progressText: '已解锁',
                unlocked: true,
                category: '语文启蒙',
                rarityLabel: '成长徽章',
                progressPercent: 100,
                encouragement: '继续听音辨音，会越来越稳'
              }
            ],
            inProgressBadges: [
              {
                code: 'weekly_champion',
                title: '本周小冠军',
                description: '本周再完成 2 关即可点亮',
                progressText: '2 / 4',
                unlocked: false,
                category: '每周挑战',
                rarityLabel: '闪亮徽章',
                progressPercent: 50,
                encouragement: '再完成 2 关，就能点亮本周节奏'
              },
              {
                code: 'reading_morning',
                title: '晨读小达人',
                description: '再完成 1 本绘本',
                progressText: '1 / 2',
                unlocked: false,
                category: '英语朗读',
                rarityLabel: '闪亮徽章',
                progressPercent: 50,
                encouragement: '再读 1 本小绘本，朗读星光就会亮起来'
              }
            ]
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '小星星的成就墙' })).toBeInTheDocument();
    expect(screen.getByText('已点亮 6 / 10 枚徽章')).toBeInTheDocument();
    expect(screen.getByText('数字小达人')).toBeInTheDocument();
    expect(screen.getByText('本周小冠军')).toBeInTheDocument();
    expect(screen.getByText('2 / 4')).toBeInTheDocument();
    expect(screen.getByText(/数学启蒙/)).toBeInTheDocument();
    expect(screen.getAllByText(/闪亮徽章/).length).toBeGreaterThan(0);
    expect(screen.getByText('再完成 2 关，就能点亮本周节奏')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
  });
});
