import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ParentDashboard } from '../pages/ParentDashboard';

describe('ParentDashboard', () => {
  test('renders learning summary, subject progress and settings', () => {
    render(
      <MemoryRouter>
        <ParentDashboard
          data={{
            childNickname: '小星星',
            todaySummary: { completedLevels: 3, studyMinutes: 18, earnedStars: 8 },
            subjectProgress: [
              { subjectCode: 'math', subjectTitle: '数学岛', progressPercent: 78 },
              { subjectCode: 'chinese', subjectTitle: '语文岛', progressPercent: 64 },
              { subjectCode: 'english', subjectTitle: '英语岛', progressPercent: 59 }
            ],
            weeklyTrend: [
              { dayLabel: '周一', minutes: 12 },
              { dayLabel: '周二', minutes: 16 },
              { dayLabel: '周三', minutes: 18 }
            ],
            weakPoints: [
              { title: '20 以内减法需要多练习', suggestion: '建议继续完成糖果加减和图像列式关卡。' }
            ],
            achievementSummary: {
              unlockedCount: 6,
              nextMilestone: '再完成 2 关点亮“本周小冠军”'
            },
            goalProgress: {
              goalMinutes: 20,
              completedMinutes: 18,
              completionPercent: 90
            },
            recommendedActions: [
              '继续完成 20 以内减法',
              '复习字母 S 到 Z'
            ],
            settings: { leaderboardEnabled: true, dailyStudyMinutes: 20 }
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('家长中心')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
    expect(screen.getByText('今日完成 3 关')).toBeInTheDocument();
    expect(screen.getByText('数学岛')).toBeInTheDocument();
    expect(screen.getByText('20 以内减法需要多练习')).toBeInTheDocument();
    expect(screen.getByText('排行榜已开启')).toBeInTheDocument();
    expect(screen.getByText('今日目标完成 90%')).toBeInTheDocument();
    expect(screen.getByText('已点亮 6 枚成就徽章')).toBeInTheDocument();
    expect(screen.getAllByText('再完成 2 关点亮“本周小冠军”')).toHaveLength(2);
    expect(screen.getByText('继续完成 20 以内减法')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看成就墙' })).toHaveAttribute('href', '/achievements');
  });
});
