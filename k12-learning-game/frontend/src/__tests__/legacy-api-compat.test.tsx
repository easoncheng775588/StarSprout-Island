import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AchievementsPage } from '../pages/AchievementsPage';
import { ContentConfigCatalog } from '../pages/ContentConfigCatalog';
import { ParentDashboard } from '../pages/ParentDashboard';

describe('Legacy API compatibility', () => {
  test('parent dashboard does not blank when an older backend omits newer report fields', () => {
    render(
      <MemoryRouter>
        <ParentDashboard
          data={{
            childNickname: '小星星',
            todaySummary: { completedLevels: 0, studyMinutes: 0, earnedStars: 0 },
            subjectProgress: [],
            weeklyTrend: [],
            weakPoints: [],
            achievementSummary: { unlockedCount: 4, nextMilestone: '下一枚最接近的是“细心守护星”' },
            goalProgress: { goalMinutes: 20, completedMinutes: 0, completionPercent: 0 },
            recommendedActions: [],
            settings: { leaderboardEnabled: true, dailyStudyMinutes: 20, reminderEnabled: false },
            learningVitals: {
              totalCompletedLevels: 5,
              averageAccuracyPercent: 86,
              strongestSubjectTitle: '数学岛',
              averageSessionMinutes: 6,
              bestLearningPeriodLabel: '晨间 06:00-09:00',
              effectiveLearningDays: 3
            },
            subjectInsights: [],
            recentActivities: [],
            siblingComparisons: [],
            stageReport: {
              stageLabel: '幼小衔接',
              completedLevels: 5,
              totalLevels: 47,
              completionPercent: 11,
              readinessLabel: '刚刚起步',
              nextMilestone: '下一阶段建议完成“10 以内加法”。'
            },
            knowledgeMap: [],
            mistakeReviewPlan: []
          } as any}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '小星星 的学习小结' })).toBeInTheDocument();
    expect(screen.getByText('本周成长周报')).toBeInTheDocument();
    expect(screen.getByText('暂无可展示的周报数据，完成更多关卡后会自动生成。')).toBeInTheDocument();
  });

  test('achievements page does not blank when an older backend omits stage families', () => {
    render(
      <MemoryRouter>
        <AchievementsPage
          data={{
            childNickname: '小星星',
            unlockedCount: 4,
            totalCount: 12,
            unlockedBadges: [],
            inProgressBadges: []
          } as any}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '小星星的成就墙' })).toBeInTheDocument();
    expect(screen.getByText('当前学段成就：当前学段')).toBeInTheDocument();
    expect(screen.getByText('当前还没有学段徽章数据，完成关卡后会自动点亮。')).toBeInTheDocument();
  });

  test('content config catalog does not blank when an older backend omits health fields', () => {
    render(
      <MemoryRouter>
        <ContentConfigCatalog
          data={{
            configuredLevelCount: 1,
            totalVariantCount: 8,
            items: [
              {
                levelCode: 'math-grade1-hundredchart-001',
                levelTitle: '百格图认数',
                subjectTitle: '数学岛',
                knowledgePointCode: 'math.g1.number-shape.hundred-chart',
                knowledgePointTitle: '数形结合：百格图认数',
                variantCount: 8,
                assetTheme: '待补素材主题',
                audioQuality: '待补音频质量',
                configSource: 'knowledge'
              }
            ]
          } as any}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '题库配置中心' })).toBeInTheDocument();
    expect(screen.getByText('配置覆盖率 100%')).toBeInTheDocument();
    expect(screen.getByText('状态：需补齐')).toBeInTheDocument();
    expect(screen.getByText('素材主题待补齐')).toBeInTheDocument();
  });
});
