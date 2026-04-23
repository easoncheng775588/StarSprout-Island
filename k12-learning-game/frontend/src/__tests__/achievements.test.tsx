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
            currentStageLabel: '一年级',
            stageFamilies: [
              {
                stageLabel: '幼小衔接',
                title: '幼小衔接成长路线',
                description: '入学准备阶段的三岛探索进度',
                unlockedCount: 4,
                totalCount: 4,
                progressPercent: 100,
                badges: [
                  {
                    code: 'stage_preschool_opener',
                    title: '幼小衔接启航星',
                    description: '完成 1 个幼小衔接关卡',
                    progressText: '已解锁',
                    unlocked: true,
                    category: '幼小衔接',
                    rarityLabel: '阶段徽章',
                    progressPercent: 100,
                    encouragement: '入学准备已经启航'
                  }
                ]
              },
              {
                stageLabel: '一年级',
                title: '一年级成长路线',
                description: '校园冒险阶段的三岛探索进度',
                unlockedCount: 1,
                totalCount: 4,
                progressPercent: 25,
                badges: [
                  {
                    code: 'stage_grade1_opener',
                    title: '一年级启航星',
                    description: '完成 1 个一年级关卡',
                    progressText: '1 / 1',
                    unlocked: true,
                    category: '一年级',
                    rarityLabel: '阶段徽章',
                    progressPercent: 100,
                    encouragement: '一年级路线已经点亮第一步'
                  }
                ]
              }
            ],
            modelBadges: [
              {
                code: 'model_bar-model',
                title: '线段图模型星',
                description: '完成线段图模型关卡',
                progressText: '2 / 3',
                unlocked: false,
                category: '思维模型',
                rarityLabel: '模型徽章',
                progressPercent: 67,
                encouragement: '继续用线段图看清数量关系'
              }
            ],
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
    expect(screen.getByText('当前学段成就：一年级')).toBeInTheDocument();
    expect(screen.getByText('一年级成长路线')).toBeInTheDocument();
    expect(screen.getByText('1 / 4 枚阶段徽章')).toBeInTheDocument();
    expect(screen.getByText('幼小衔接启航星')).toBeInTheDocument();
    expect(screen.getByText('思维模型徽章')).toBeInTheDocument();
    expect(screen.getByText('线段图模型星')).toBeInTheDocument();
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
    expect(screen.getByText('继续用线段图看清数量关系')).toBeInTheDocument();
    expect(screen.getByText('数字小达人')).toBeInTheDocument();
    expect(screen.getByText('本周小冠军')).toBeInTheDocument();
    expect(screen.getByText('2 / 4')).toBeInTheDocument();
    expect(screen.getByText(/数学启蒙/)).toBeInTheDocument();
    expect(screen.getAllByText(/闪亮徽章/).length).toBeGreaterThan(0);
    expect(screen.getByText('再完成 2 关，就能点亮本周节奏')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
  });
});
