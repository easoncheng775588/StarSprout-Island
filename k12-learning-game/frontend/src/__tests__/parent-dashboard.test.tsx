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
            weeklyReport: {
              title: '小星星的本周成长周报',
              dateRangeLabel: '04月16日-04月22日',
              summary: '本周完成 5 关，学习 31 分钟，收集 11 颗星星。',
              highlightText: '数学岛推进最明显，已经形成稳定的主线节奏。',
              growthFocus: '下周重点：继续巩固 20 以内减法。',
              parentAction: '建议每天 15-20 分钟，先复习错题再挑战下一关。',
              completedLevels: 5,
              studyMinutes: 31,
              earnedStars: 11,
              averageAccuracyPercent: 86,
              effectiveLearningDays: 3,
              subjectHighlights: ['数学岛：完成 3 关，准确率 88%', '英语岛：完成 1 关，准确率 80%', '数感快练：20 以内加减仍需巩固，建议今晚先做 1 组慢练']
            },
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
            weakPointActionPlan: [
              {
                subjectTitle: '数学岛',
                knowledgePointTitle: '20 以内退位减法',
                priorityLabel: '优先陪练',
                actionStatusLabel: '待复习',
                actionStatusDescription: '还没有针对这个知识点完成复习，建议今晚先安排 1 组。',
                focusReason: '错题 3 次，建议先用实物图复盘。',
                parentGuidance: '陪孩子摆 10 个积木，边拿走边说出算式。',
                practicePlan: '先讲错因，再完成 1 组同类变式。',
                targetLevelCode: 'math-subtraction-002'
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
            settings: { leaderboardEnabled: true, dailyStudyMinutes: 20, reminderEnabled: false, practiceIntensity: 'standard' },
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
            siblingComparisons: [
              {
                childNickname: '小星星',
                stageLabel: '幼小衔接',
                completedLevels: 5,
                weeklyStars: 10,
                averageAccuracyPercent: 86,
                activeChild: true,
                statusLabel: '当前查看'
              },
              {
                childNickname: '小火箭',
                stageLabel: '幼小衔接',
                completedLevels: 7,
                weeklyStars: 14,
                averageAccuracyPercent: 100,
                activeChild: false,
                statusLabel: '本周星星更多'
              }
            ],
            stageReport: {
              stageLabel: '一年级',
              completedLevels: 8,
              totalLevels: 24,
              completionPercent: 33,
              readinessLabel: '主线起步中',
              nextMilestone: '再完成 4 关，进入一年级巩固阶段'
            },
            stageTrend: [
              { weekLabel: '3周前', studyMinutes: 12, completedLevels: 2, averageAccuracyPercent: 78, fluencyAttemptCount: 0 },
              { weekLabel: '2周前', studyMinutes: 18, completedLevels: 3, averageAccuracyPercent: 82, fluencyAttemptCount: 1 },
              { weekLabel: '上周', studyMinutes: 24, completedLevels: 4, averageAccuracyPercent: 84, fluencyAttemptCount: 2 },
              { weekLabel: '本周', studyMinutes: 31, completedLevels: 5, averageAccuracyPercent: 86, fluencyAttemptCount: 4 }
            ],
            weekOverWeek: {
              studyMinutesDelta: 7,
              completedLevelsDelta: 1,
              accuracyDelta: 2,
              fluencyAttemptDelta: 2,
              summary: '本周比上周多学 7 分钟，多完成 1 关，数感快练也更稳定了。'
            },
            fluencySummary: {
              attemptCount: 4,
              averageAccuracyPercent: 92,
              latestStageLabel: '一年级',
              latestAccuracyPercent: 100,
              latestRecordedAtLabel: '今天 19:10',
              encouragement: '本周已经完成 4 次快练，可以继续保持每天 1 次的节奏。',
              fluencyTrend: [
                { dayLabel: '周一', averageAccuracyPercent: 78, attemptCount: 1 },
                { dayLabel: '周二', averageAccuracyPercent: 88, attemptCount: 1 },
                { dayLabel: '周三', averageAccuracyPercent: 100, attemptCount: 1 },
                { dayLabel: '周四', averageAccuracyPercent: 0, attemptCount: 0 },
                { dayLabel: '周五', averageAccuracyPercent: 92, attemptCount: 1 },
                { dayLabel: '周六', averageAccuracyPercent: 96, attemptCount: 1 },
                { dayLabel: '周日', averageAccuracyPercent: 0, attemptCount: 0 }
              ],
              stageInsights: [
                {
                  stageLabel: '幼小衔接',
                  attemptCount: 1,
                  averageAccuracyPercent: 68,
                  statusLabel: '建议回看',
                  recommendation: '建议先回到幼小衔接做慢练，边说思路边完成 1 组。'
                },
                {
                  stageLabel: '一年级',
                  attemptCount: 2,
                  averageAccuracyPercent: 84,
                  statusLabel: '继续巩固',
                  recommendation: '建议继续完成一年级快练，先把正确率稳在 90% 左右。'
                },
                {
                  stageLabel: '二年级',
                  attemptCount: 1,
                  averageAccuracyPercent: 100,
                  statusLabel: '稳定发挥',
                  recommendation: '可以继续保持二年级快练节奏，准备挑战更高一层。'
                }
              ],
              typeInsights: [
                {
                  focusArea: 'addition-within-20',
                  focusAreaLabel: '20 以内加减',
                  attemptCount: 2,
                  averageAccuracyPercent: 76,
                  statusLabel: '继续巩固',
                  recommendation: '建议今晚先用 20 以内加减做慢练，再进入下一组快练。'
                },
                {
                  focusArea: 'multiplication-division',
                  focusAreaLabel: '乘除数感',
                  attemptCount: 2,
                  averageAccuracyPercent: 100,
                  statusLabel: '稳定发挥',
                  recommendation: '乘除数感已经很稳，可以继续保持轻快节奏。'
                }
              ]
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
            thinkingModelProgress: [
              {
                modelCode: 'bar-model',
                modelTitle: '线段图模型',
                modelTypeLabel: '数量关系',
                completedLevels: 2,
                totalLevels: 3,
                progressPercent: 67,
                nextAction: '继续用线段图把故事题里的数量关系画出来。'
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
    expect(screen.getByText('本周成长周报')).toBeInTheDocument();
    expect(screen.getByText('小星星的本周成长周报')).toBeInTheDocument();
    expect(screen.getByText('04月16日-04月22日')).toBeInTheDocument();
    expect(screen.getByText('本周完成 5 关，学习 31 分钟，收集 11 颗星星。')).toBeInTheDocument();
    expect(screen.getByText('下周重点：继续巩固 20 以内减法。')).toBeInTheDocument();
    expect(screen.getByText('数学岛：完成 3 关，准确率 88%')).toBeInTheDocument();
    expect(screen.getByText('数感快练：20 以内加减仍需巩固，建议今晚先做 1 组慢练')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '打印/导出周报' })).toBeInTheDocument();
    expect(screen.getAllByText('数学岛').length).toBeGreaterThan(0);
    expect(screen.getByText('20 以内减法需要多练习')).toBeInTheDocument();
    expect(screen.getByText('最近 7 天数学岛正确率 72%，比整体平均低了 14%。')).toBeInTheDocument();
    expect(screen.getByText('薄弱点陪练计划')).toBeInTheDocument();
    expect(screen.getByText('20 以内退位减法')).toBeInTheDocument();
    expect(screen.getByText('待复习')).toBeInTheDocument();
    expect(screen.getByText('还没有针对这个知识点完成复习，建议今晚先安排 1 组。')).toBeInTheDocument();
    expect(screen.getByText('错题 3 次，建议先用实物图复盘。')).toBeInTheDocument();
    expect(screen.getByText('陪孩子摆 10 个积木，边拿走边说出算式。')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '打开陪练关卡' })).toHaveAttribute('href', '/levels/math-subtraction-002');
    expect(screen.getByText('多孩子对比')).toBeInTheDocument();
    expect(screen.getByText('小火箭')).toBeInTheDocument();
    expect(screen.getByText('本周 14 颗星星')).toBeInTheDocument();
    expect(screen.getByText('准确率 100% · 已完成 7 关')).toBeInTheDocument();
    expect(screen.getByText('快练题型洞察')).toBeInTheDocument();
    expect(screen.getByText('20 以内加减')).toBeInTheDocument();
    expect(screen.getByText('建议今晚先用 20 以内加减做慢练，再进入下一组快练。')).toBeInTheDocument();
    expect(screen.getByText('排行榜已开启')).toBeInTheDocument();
    expect(screen.getByText('练习强度：标准')).toBeInTheDocument();
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
    expect(screen.getByText('阶段趋势')).toBeInTheDocument();
    expect(screen.getAllByText('本周比上周多学 7 分钟，多完成 1 关，数感快练也更稳定了。')).toHaveLength(2);
    expect(screen.getByText('快练 4 次')).toBeInTheDocument();
    expect(screen.getByText('数感快练趋势')).toBeInTheDocument();
    expect(screen.getByText('本周完成 4 次快练')).toBeInTheDocument();
    expect(screen.getByText('平均正确率 92%')).toBeInTheDocument();
    expect(screen.getByText('最近一次：一年级 · 100% · 今天 19:10')).toBeInTheDocument();
    expect(screen.getByText('本周已经完成 4 次快练，可以继续保持每天 1 次的节奏。')).toBeInTheDocument();
    expect(screen.getByText('7 天小趋势')).toBeInTheDocument();
    expect(screen.getByLabelText('周三 数感快练正确率 100%，完成 1 次')).toBeInTheDocument();
    expect(screen.getByLabelText('周四 数感快练未练习')).toBeInTheDocument();
    expect(screen.getByText('周六')).toBeInTheDocument();
    expect(screen.getByText('96%')).toBeInTheDocument();
    expect(screen.getByText('快练分层洞察')).toBeInTheDocument();
    expect(screen.getAllByText('幼小衔接').length).toBeGreaterThan(0);
    expect(screen.getByText('建议回看')).toBeInTheDocument();
    expect(screen.getByText('建议先回到幼小衔接做慢练，边说思路边完成 1 组。')).toBeInTheDocument();
    expect(screen.getAllByText('稳定发挥').length).toBeGreaterThan(0);
    expect(screen.getByText('可以继续保持二年级快练节奏，准备挑战更高一层。')).toBeInTheDocument();
    expect(screen.getByText('知识点掌握图谱')).toBeInTheDocument();
    expect(screen.getAllByText('20 以内加减法')).toHaveLength(2);
    expect(screen.getByText('掌握度 72% · 巩固中')).toBeInTheDocument();
    expect(screen.getByText('每天完成 1 次图像列式练习')).toBeInTheDocument();
    expect(screen.getByText('用苹果图再做 1 组看图列式')).toBeInTheDocument();
    expect(screen.getByText('思维模型成长')).toBeInTheDocument();
    expect(screen.getByText('线段图模型')).toBeInTheDocument();
    expect(screen.getByText('数量关系 · 2 / 3 关')).toBeInTheDocument();
    expect(screen.getByText('继续用线段图把故事题里的数量关系画出来。')).toBeInTheDocument();
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
              reminderEnabled: true,
              practiceIntensity: 'challenge'
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
            weeklyReport: {
              title: '小星星的本周成长周报',
              dateRangeLabel: '04月16日-04月22日',
              summary: '本周完成 5 关，学习 31 分钟，收集 11 颗星星。',
              highlightText: '数学岛推进最明显，已经形成稳定的主线节奏。',
              growthFocus: '下周重点：继续巩固 20 以内减法。',
              parentAction: '建议每天 15-20 分钟，先复习错题再挑战下一关。',
              completedLevels: 5,
              studyMinutes: 31,
              earnedStars: 11,
              averageAccuracyPercent: 86,
              effectiveLearningDays: 3,
              subjectHighlights: []
            },
            subjectProgress: [],
            weeklyTrend: [],
            weakPoints: [],
            weakPointActionPlan: [],
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
            settings: { leaderboardEnabled: true, dailyStudyMinutes: 20, reminderEnabled: false, practiceIntensity: 'standard' },
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
            siblingComparisons: [],
            stageReport: {
              stageLabel: '一年级',
              completedLevels: 8,
              totalLevels: 24,
              completionPercent: 33,
              readinessLabel: '主线起步中',
              nextMilestone: '再完成 4 关，进入一年级巩固阶段'
            },
            stageTrend: [],
            weekOverWeek: {
              studyMinutesDelta: 0,
              completedLevelsDelta: 0,
              accuracyDelta: 0,
              fluencyAttemptDelta: 0,
              summary: '最近两周还在继续积累学习数据。'
            },
            fluencySummary: {
              attemptCount: 0,
              averageAccuracyPercent: 0,
              latestStageLabel: '一年级',
              latestAccuracyPercent: 0,
              latestRecordedAtLabel: '',
              encouragement: '本周还没有开始数感快练，可以先用 1 分钟热热身。',
              fluencyTrend: [],
              stageInsights: [],
              typeInsights: []
            },
            knowledgeMap: [],
            thinkingModelProgress: [],
            mistakeReviewPlan: []
          }}
        />
      </MemoryRouter>
    );

    await user.clear(screen.getByLabelText('每日目标学习时长'));
    await user.type(screen.getByLabelText('每日目标学习时长'), '25');
    await user.click(screen.getByLabelText('关闭排行榜参与'));
    await user.click(screen.getByLabelText('开启连续学习提醒'));
    await user.selectOptions(screen.getByLabelText('练习强度偏好'), 'challenge');
    await user.click(screen.getByRole('button', { name: '保存家长设置' }));

    expect(await screen.findByText('排行榜已关闭')).toBeInTheDocument();
    expect(screen.getByText('建议时长 25 分钟')).toBeInTheDocument();
    expect(screen.getByText('连续学习提醒已开启')).toBeInTheDocument();
    expect(screen.getByText('练习强度：挑战')).toBeInTheDocument();
  });
});
