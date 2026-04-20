import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import type { ParentDashboardData } from '../api';
import { ParentDashboard } from '../pages/ParentDashboard';

describe('ParentDashboard', () => {
  test('renders learning summary, subject progress and settings', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

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
              {
                title: '20 以内减法需要多练习',
                suggestion: '建议继续完成糖果加减和图像列式关卡。',
                reason: '最近 7 天数学岛正确率 72%，比整体平均低了 14%。'
              }
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
              {
                title: '继续完成 20 以内减法',
                reason: '这是数学岛当前主线的下一关，完成后能补齐减法基础。',
                targetSubject: '数学岛'
              },
              {
                title: '复习字母 S 到 Z',
                reason: '英语岛最近 3 次练习里，字母辨认速度偏慢。',
                targetSubject: '英语岛'
              }
            ],
            settings: { leaderboardEnabled: true, dailyStudyMinutes: 20, reminderEnabled: false },
            learningVitals: {
              totalCompletedLevels: 5,
              averageAccuracyPercent: 86,
              strongestSubjectTitle: '数学岛',
              averageSessionMinutes: 6,
              bestLearningPeriodLabel: '傍晚 18:00-20:00',
              effectiveLearningDays: 3
            },
            subjectInsights: [
              {
                subjectCode: 'math',
                subjectTitle: '数学岛',
                completedLevels: 3,
                totalLevels: 11,
                accuracyPercent: 88,
                studyMinutes: 10,
                nextLevelTitle: '10 以内加法',
                nextLevelReason: '前面的数字认识已经稳定完成，下一步正好进入加法启蒙。'
              },
              {
                subjectCode: 'english',
                subjectTitle: '英语岛',
                completedLevels: 1,
                totalLevels: 12,
                accuracyPercent: 80,
                studyMinutes: 5,
                nextLevelTitle: '字母 G 到 L',
                nextLevelReason: 'A-F 已经完成，继续往后能保持字母学习的连续性。'
              }
            ],
            recentActivities: [
              { subjectTitle: '语文岛', levelTitle: '拼音泡泡大作战', completedAtLabel: '今天 18:35', earnedStars: 1 },
              { subjectTitle: '数学岛', levelTitle: '数字小探险', completedAtLabel: '今天 17:35', earnedStars: 3 }
            ],
            stageReport: {
              stageLabel: '一年级',
              completedLevels: 8,
              totalLevels: 24,
              completionPercent: 33,
              readinessLabel: '主线起步中',
              nextMilestone: '再完成 4 关，进入一年级巩固阶段'
            },
            knowledgeMap: [
              {
                knowledgePointCode: 'math.add-subtract.core',
                subjectTitle: '数学岛',
                knowledgePointTitle: '20 以内加减法',
                masteryPercent: 72,
                statusLabel: '巩固中',
                nextAction: '每天完成 1 次图像列式练习'
              },
              {
                knowledgePointCode: 'math.add-subtract.visual',
                subjectTitle: '数学岛',
                knowledgePointTitle: '20 以内加减法',
                masteryPercent: 48,
                statusLabel: '待强化',
                nextAction: '用苹果图再做 1 组看图列式'
              }
            ],
            mistakeReviewPlan: [
              {
                levelTitle: '糖果减法小店',
                knowledgePointTitle: '20 以内退位减法',
                mistakeCount: 3,
                reviewAction: '先用实物图复盘，再做 3 题同类变式',
                targetLevelCode: 'math-subtraction-002'
              }
            ]
          } as ParentDashboardData}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('家长中心')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回首页' })).toHaveAttribute('href', '/');
    expect(screen.getByText('今日完成 3 关')).toBeInTheDocument();
    expect(screen.getAllByText('数学岛').length).toBeGreaterThan(0);
    expect(screen.getByText('20 以内减法需要多练习')).toBeInTheDocument();
    expect(screen.getByText('最近 7 天数学岛正确率 72%，比整体平均低了 14%。')).toBeInTheDocument();
    expect(screen.getByText('排行榜已开启')).toBeInTheDocument();
    expect(screen.getByText('今日目标完成 90%')).toBeInTheDocument();
    expect(screen.getByText('已点亮 6 枚成就徽章')).toBeInTheDocument();
    expect(screen.getAllByText('再完成 2 关点亮“本周小冠军”')).toHaveLength(2);
    expect(screen.getByText('继续完成 20 以内减法')).toBeInTheDocument();
    expect(screen.getByText('这是数学岛当前主线的下一关，完成后能补齐减法基础。')).toBeInTheDocument();
    expect(screen.getByText('累计完成 5 关')).toBeInTheDocument();
    expect(screen.getByText('平均准确率 86%')).toBeInTheDocument();
    expect(screen.getByText('平均单关用时 6 分钟')).toBeInTheDocument();
    expect(screen.getByText('最投入时段：傍晚 18:00-20:00')).toBeInTheDocument();
    expect(screen.getByText('近 7 天有效学习 3 天')).toBeInTheDocument();
    expect(screen.getByText('已完成 3 / 11 关')).toBeInTheDocument();
    expect(screen.getByText('下一关建议：10 以内加法')).toBeInTheDocument();
    expect(screen.getByText('前面的数字认识已经稳定完成，下一步正好进入加法启蒙。')).toBeInTheDocument();
    expect(screen.getByText('拼音泡泡大作战')).toBeInTheDocument();
    expect(screen.getByText('今天 18:35 · 1 颗星星')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看成就墙' })).toHaveAttribute('href', '/achievements');
    expect(screen.getByText('阶段报告')).toBeInTheDocument();
    expect(screen.getByText('一年级 · 主线起步中')).toBeInTheDocument();
    expect(screen.getByText('已完成 8 / 24 关')).toBeInTheDocument();
    expect(screen.getByText('再完成 4 关，进入一年级巩固阶段')).toBeInTheDocument();
    expect(screen.getByText('知识点掌握图谱')).toBeInTheDocument();
    expect(screen.getAllByText('20 以内加减法')).toHaveLength(2);
    expect(screen.getByText('掌握度 72% · 巩固中')).toBeInTheDocument();
    expect(screen.getByText('每天完成 1 次图像列式练习')).toBeInTheDocument();
    expect(screen.getByText('用苹果图再做 1 组看图列式')).toBeInTheDocument();
    expect(screen.getByText('错题复习闭环')).toBeInTheDocument();
    expect(screen.getByText('糖果减法小店')).toBeInTheDocument();
    expect(screen.getByText('错题 3 次 · 20 以内退位减法')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '去复习糖果减法小店' })).toHaveAttribute('href', '/levels/math-subtraction-002');
    expect(consoleErrorSpy.mock.calls.map((call) => String(call[0])).join('\n')).not.toContain('Encountered two children with the same key');
    consoleErrorSpy.mockRestore();
  });

  test('saves parent settings and updates the visible summary', async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);

        if (url.endsWith('/api/parent/settings') && init?.method === 'PATCH') {
          return {
            ok: true,
            json: async () => ({
              leaderboardEnabled: false,
              dailyStudyMinutes: 25,
              reminderEnabled: true
            })
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );

    render(
      <MemoryRouter>
        <ParentDashboard
          data={{
            childNickname: '小星星',
            todaySummary: { completedLevels: 3, studyMinutes: 18, earnedStars: 8 },
            subjectProgress: [],
            weeklyTrend: [],
            weakPoints: [],
            achievementSummary: {
              unlockedCount: 6,
              nextMilestone: '再完成 2 关点亮“本周小冠军”'
            },
            goalProgress: {
              goalMinutes: 20,
              completedMinutes: 18,
              completionPercent: 90
            },
            recommendedActions: [],
            settings: { leaderboardEnabled: true, dailyStudyMinutes: 20, reminderEnabled: false },
            learningVitals: {
              totalCompletedLevels: 5,
              averageAccuracyPercent: 86,
              strongestSubjectTitle: '数学岛',
              averageSessionMinutes: 6,
              bestLearningPeriodLabel: '傍晚 18:00-20:00',
              effectiveLearningDays: 3
            },
            subjectInsights: [],
            recentActivities: [],
            stageReport: {
              stageLabel: '一年级',
              completedLevels: 8,
              totalLevels: 24,
              completionPercent: 33,
              readinessLabel: '主线起步中',
              nextMilestone: '再完成 4 关，进入一年级巩固阶段'
            },
            knowledgeMap: [],
            mistakeReviewPlan: []
          }}
        />
      </MemoryRouter>
    );

    await user.clear(screen.getByLabelText('每日目标学习时长'));
    await user.type(screen.getByLabelText('每日目标学习时长'), '25');
    await user.click(screen.getByLabelText('关闭排行榜参与'));
    await user.click(screen.getByLabelText('开启连续学习提醒'));
    await user.click(screen.getByRole('button', { name: '保存家长设置' }));

    expect(await screen.findByText('排行榜已关闭')).toBeInTheDocument();
    expect(screen.getByText('建议时长 25 分钟')).toBeInTheDocument();
    expect(screen.getByText('连续学习提醒已开启')).toBeInTheDocument();
  });
});
