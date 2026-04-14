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
  });
});
