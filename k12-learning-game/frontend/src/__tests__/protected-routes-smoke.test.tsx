import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import App from '../App';

function buildParentDashboardResponse() {
  return {
    childNickname: '小星星',
    todaySummary: {
      completedLevels: 2,
      studyMinutes: 18,
      earnedStars: 5
    },
    weeklyReport: {
      title: '本周成长周报',
      dateRangeLabel: '4月第4周',
      summary: '主线和快练都在稳步推进。',
      highlightText: '数学和英语都有新进展。',
      growthFocus: '继续稳住数感和拼读节奏。',
      parentAction: '今晚一起回看 1 个知识点。',
      completedLevels: 6,
      studyMinutes: 82,
      earnedStars: 16,
      averageAccuracyPercent: 86,
      effectiveLearningDays: 5,
      subjectHighlights: ['数学岛完成 3 关', '英语岛快练状态稳定']
    },
    subjectProgress: [
      { subjectCode: 'math', subjectTitle: '数学岛', progressPercent: 48 },
      { subjectCode: 'chinese', subjectTitle: '语文岛', progressPercent: 36 },
      { subjectCode: 'english', subjectTitle: '英语岛', progressPercent: 41 }
    ],
    weeklyTrend: [
      { dayLabel: '周一', minutes: 12 },
      { dayLabel: '周二', minutes: 16 },
      { dayLabel: '周三', minutes: 18 }
    ],
    weakPoints: [
      {
        title: '数学岛还需要多一点细心练习',
        suggestion: '建议下一步继续挑战“20 以内加法”。',
        reason: '最近两次加法题容易粗心。'
      }
    ],
    weakPointActionPlan: [
      {
        subjectTitle: '数学岛',
        knowledgePointTitle: '20 以内加减',
        priorityLabel: '今天优先',
        actionStatusLabel: '已复习待巩固',
        actionStatusDescription: '昨天已经回看过一次，今晚再做 1 组就更稳。',
        focusReason: '最近两次快练都卡在进退位。',
        parentGuidance: '陪孩子边摆边说出算式。',
        practicePlan: '先复习，再做同类题。',
        targetLevelCode: 'math-addition-001'
      }
    ],
    achievementSummary: {
      unlockedCount: 4,
      nextMilestone: '再完成 2 关就能点亮下一枚徽章。'
    },
    goalProgress: {
      goalMinutes: 20,
      completedMinutes: 18,
      completionPercent: 90
    },
    recommendedActions: [
      {
        title: '继续挑战 20 以内加法',
        reason: '今天的主线节奏正适合继续推进。',
        targetSubject: '数学岛'
      }
    ],
    settings: {
      leaderboardEnabled: true,
      dailyStudyMinutes: 20,
      reminderEnabled: false,
      practiceIntensity: 'standard'
    },
    learningVitals: {
      totalCompletedLevels: 8,
      averageAccuracyPercent: 86,
      strongestSubjectTitle: '数学岛',
      averageSessionMinutes: 8,
      bestLearningPeriodLabel: '晚饭后',
      effectiveLearningDays: 5
    },
    subjectInsights: [
      {
        subjectCode: 'math',
        subjectTitle: '数学岛',
        completedLevels: 3,
        totalLevels: 10,
        accuracyPercent: 88,
        studyMinutes: 26,
        nextLevelTitle: '20 以内加法',
        nextLevelReason: '主线已经热起来了。'
      }
    ],
    recentActivities: [
      {
        subjectTitle: '数学岛',
        levelTitle: '数字小探险',
        completedAtLabel: '今天',
        earnedStars: 3
      }
    ],
    siblingComparisons: [
      {
        childNickname: '小星星',
        stageLabel: '幼小衔接',
        completedLevels: 8,
        weeklyStars: 16,
        averageAccuracyPercent: 86,
        activeChild: true,
        statusLabel: '当前查看'
      }
    ],
    stageReport: {
      stageLabel: '幼小衔接',
      completedLevels: 8,
      totalLevels: 32,
      completionPercent: 25,
      readinessLabel: '继续探索',
      nextMilestone: '再完成 2 个章节就能点亮阶段证书。'
    },
    stageTrend: [
      { weekLabel: '3周前', studyMinutes: 24, completedLevels: 3, averageAccuracyPercent: 76, fluencyAttemptCount: 1 },
      { weekLabel: '2周前', studyMinutes: 32, completedLevels: 4, averageAccuracyPercent: 80, fluencyAttemptCount: 2 },
      { weekLabel: '上周', studyMinutes: 40, completedLevels: 5, averageAccuracyPercent: 84, fluencyAttemptCount: 3 },
      { weekLabel: '本周', studyMinutes: 48, completedLevels: 6, averageAccuracyPercent: 86, fluencyAttemptCount: 4 }
    ],
    weekOverWeek: {
      studyMinutesDelta: 8,
      completedLevelsDelta: 1,
      accuracyDelta: 2,
      fluencyAttemptDelta: 1,
      summary: '本周比上周多学 8 分钟，多完成 1 关，准确率提升 2%，数感快练多了 1 次。'
    },
    fluencySummary: {
      attemptCount: 4,
      averageAccuracyPercent: 85,
      latestStageLabel: '幼小衔接',
      latestAccuracyPercent: 100,
      latestRecordedAtLabel: '昨天',
      encouragement: '本周已经完成 4 次快练，可以继续保持。',
      fluencyTrend: [
        { dayLabel: '周一', attemptCount: 1, averageAccuracyPercent: 80 },
        { dayLabel: '周二', attemptCount: 1, averageAccuracyPercent: 100 }
      ],
      stageInsights: [
        {
          stageLabel: '幼小衔接',
          attemptCount: 4,
          averageAccuracyPercent: 85,
          statusLabel: '继续保持',
          recommendation: '每天 1 次快练就很好。'
        }
      ],
      typeInsights: [
        {
          focusArea: 'number-sense',
          focusAreaLabel: '数感启蒙',
          attemptCount: 2,
          averageAccuracyPercent: 80,
          statusLabel: '继续保持',
          recommendation: '保持一题一题稳稳做。'
        }
      ]
    },
    knowledgeMap: [
      {
        knowledgePointCode: 'math.preschool.number-sense',
        knowledgePointTitle: '数感启蒙',
        masteryPercent: 66,
        statusLabel: '继续推进',
        subjectTitle: '数学岛'
      }
    ],
    thinkingModelProgress: [],
    mistakeReviewPlan: []
  };
}

describe('Protected routes smoke', () => {
  beforeEach(() => {
    window.localStorage.setItem(
      'k12-learning-game-session',
      JSON.stringify({
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: 1,
        childNickname: '小星星',
        children: [
          {
            id: 1,
            nickname: '小星星',
            streakDays: 7,
            totalStars: 126,
            title: '晨光冒险家',
            stageLabel: '幼小衔接',
            avatarColor: '#ffcf70'
          }
        ]
      })
    );

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);

        if (url.endsWith('/api/home/overview')) {
          return {
            ok: true,
            json: async () => ({
              child: {
                id: 1,
                nickname: '小星星',
                streakDays: 7,
                totalStars: 126,
                title: '晨光冒险家'
              },
              subjects: [
                { code: 'math', title: '数学岛', subtitle: '数字火花开始跳舞', accentColor: '#ff8a5b' },
                { code: 'chinese', title: '语文岛', subtitle: '拼音种子正在发芽', accentColor: '#f2c14e' },
                { code: 'english', title: '英语岛', subtitle: '单词海风轻轻吹', accentColor: '#39b7a5' }
              ],
              achievementPreview: {
                unlockedCount: 4,
                totalCount: 12,
                nextBadgeName: '本周小冠军'
              },
              featuredWorld: '启航岛',
              todayTask: '完成每日任务，给小岛补充星光能量。',
              nextLevelCode: 'math-numbers-001',
              nextLevelTitle: '认识 0-10'
            })
          } as Response;
        }

        if (url.endsWith('/api/subjects/math/map')) {
          return {
            ok: true,
            json: async () => ({
              subject: { code: 'math', title: '数学岛' },
              chapters: [
                {
                  code: 'math-numbers',
                  title: '数字启蒙站',
                  subtitle: '从看见数量到会认数字。',
                  levels: [
                    { code: 'math-numbers-001', title: '认识 0-10', status: 'recommended' }
                  ]
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/levels/math-numbers-001')) {
          return {
            ok: true,
            json: async () => ({
              code: 'math-numbers-001',
              title: '数字小探险',
              subjectTitle: '数学岛',
              description: '拖一拖、选一选，把数字和数量变成好朋友。',
              steps: [
                {
                  id: 'step-1',
                  type: 'drag-match',
                  prompt: '把 5 个苹果拖进篮子'
                }
              ],
              reward: {
                stars: 3,
                badgeName: '数字小达人'
              }
            })
          } as Response;
        }

        if (url.endsWith('/api/parent/dashboard')) {
          return {
            ok: true,
            json: async () => buildParentDashboardResponse()
          } as Response;
        }

        if (url.endsWith('/api/daily-tasks')) {
          return {
            ok: true,
            json: async () => ({
              childNickname: '小星星',
              completedCount: 1,
              totalCount: 3,
              bonusStars: 5,
              tasks: [
                {
                  code: 'mainline-next',
                  title: '完成主线下一关',
                  description: '继续挑战数字小探险，保持今天的学习节奏。',
                  taskType: '主线',
                  completed: false,
                  statusLabel: '待完成',
                  targetLevelCode: 'math-numbers-001',
                  rewardText: '+2 星光',
                  rewardClaimed: false,
                  claimable: false
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/fluency/practice')) {
          return {
            ok: true,
            json: async () => ({
              stageLabel: '幼小衔接',
              focusArea: 'number-sense',
              focusAreaLabel: '数感启蒙',
              questions: [
                { prompt: '2 + 3 = ?', choices: [4, 5, 6], answer: 5 },
                { prompt: '6 - 1 = ?', choices: [4, 5, 7], answer: 5 }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/mistakes/review')) {
          return {
            ok: true,
            json: async () => ({
              childNickname: '小星星',
              totalMistakes: 2,
              readyToMasterCount: 1,
              items: [
                {
                  levelCode: 'math-numbers-002',
                  targetLevelCode: 'math-numbers-002',
                  levelTitle: '数到二十站',
                  subjectTitle: '数学岛',
                  mistakeCount: 2,
                  masteryStatus: '继续巩固',
                  reviewPrompt: '先复习“认识 11-20”的关键点，再做一组同类题。',
                  reviewSteps: ['再看一遍数字卡', '做一组同类题'],
                  knowledgePointCode: 'math.preschool.number-sense.teen-number',
                  knowledgePointTitle: '认识 11-20'
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/learning-path')) {
          return {
            ok: true,
            json: async () => ({
              stageLabel: '幼小衔接',
              completedLevels: 2,
              totalLevels: 3,
              chapters: [
                {
                  subjectCode: 'math',
                  subjectTitle: '数学岛',
                  chapterTitle: '数字启蒙站',
                  chapterSubtitle: '从看见数量到会认数字。',
                  unitGoal: '会看数量，会认数字。',
                  completedLevelCount: 2,
                  totalLevelCount: 3,
                  completionPercent: 67,
                  checkpointLevelCode: 'math-addition-001',
                  checkpointCtaText: '开始单元小测',
                  levels: [
                    { levelCode: 'math-numbers-001', levelTitle: '认识 0-10', status: 'completed', locked: false, lockReason: '' },
                    { levelCode: 'math-numbers-002', levelTitle: '认识 11-20', status: 'completed', locked: false, lockReason: '' },
                    { levelCode: 'math-addition-001', levelTitle: '10 以内加法', status: 'recommended', locked: false, lockReason: '' }
                  ]
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/leaderboard/weekly_star')) {
          return {
            ok: true,
            json: async () => ({
              boardType: 'weekly_star',
              boardTitle: '本周星星榜',
              metricUnit: '颗星',
              participationEnabled: true,
              settlementWindowLabel: '每周一结算',
              updatedAtLabel: '今天 20:00 更新',
              nextTargetText: '再获得 3 颗星就能进入前 3。',
              myRank: {
                rank: 4,
                nickname: '小星星',
                stars: 126,
                trendLabel: '本周上升 2 名'
              },
              topPlayers: [
                { rank: 1, nickname: '小海豚', stars: 228, trendLabel: '保持领先' }
              ],
              nearbyPlayers: [
                { rank: 4, nickname: '小星星', stars: 126, trendLabel: '继续加油' }
              ],
              privacyTip: '排行榜默认匿名展示。'
            })
          } as Response;
        }

        if (url.endsWith('/api/achievements')) {
          return {
            ok: true,
            json: async () => ({
              childNickname: '小星星',
              unlockedCount: 4,
              totalCount: 12,
              currentStageLabel: '幼小衔接',
              stageFamilies: [
                {
                  stageLabel: '幼小衔接',
                  title: '启航岛家族',
                  description: '把启航阶段的关键节点逐步点亮。',
                  unlockedCount: 2,
                  totalCount: 4,
                  progressPercent: 50,
                  badges: [
                    { code: 'stage-start', title: '启航徽章', unlocked: true },
                    { code: 'stage-mid', title: '探索徽章', unlocked: false }
                  ]
                }
              ],
              modelBadges: [],
              unlockedBadges: [
                {
                  code: 'math-first',
                  title: '数字小达人',
                  category: '数学岛',
                  rarityLabel: '基础',
                  description: '完成第一次数学挑战。',
                  progressText: '1 / 1',
                  progressPercent: 100,
                  encouragement: '继续保持。'
                }
              ],
              inProgressBadges: [
                {
                  code: 'steady-streak',
                  title: '稳稳坚持',
                  category: '学习习惯',
                  rarityLabel: '成长',
                  description: '连续学习 10 天。',
                  progressText: '7 / 10',
                  progressPercent: 70,
                  encouragement: '再坚持 3 天就能点亮。'
                }
              ]
            })
          } as Response;
        }

        if (url.endsWith('/api/content/configs/math-grade4-decimal-001')) {
          return {
            ok: true,
            json: async () => ({
              levelCode: 'math-grade4-decimal-001',
              levelTitle: '小数点灯塔',
              subjectTitle: '数学岛',
              stepCode: 'step-1',
              stepPrompt: '认识 0.7 表示多少',
              knowledgePointCode: 'math.g4.decimal.tenths',
              knowledgePointTitle: '小数初步：十分位',
              variantCount: 6,
              activityConfigJson: '{"kind":"number-choice","assetTheme":"小数灯塔","audioQuality":"高质量儿童 TTS"}',
              assetTheme: '小数灯塔',
              audioQuality: '高质量儿童 TTS',
              configSource: 'activityConfigJson+knowledge',
              healthStatus: 'healthy',
              healthNotes: ['配置完整']
            })
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.unstubAllGlobals();
  });

  test.each([
    ['/', '点亮今天的学习星轨'],
    ['/subjects/math', '数学岛'],
    ['/levels/math-numbers-001', '数字小探险'],
    ['/parent', '小星星 的学习小结'],
    ['/daily-tasks', '小星星的每日任务'],
    ['/fluency', '1 分钟数感快练'],
    ['/assessment', '数学能力小测评'],
    ['/mistakes', '错题本'],
    ['/learning-path', '幼小衔接学习路径'],
    ['/leaderboard', '你附近的排名'],
    ['/achievements', '小星星的成就墙'],
    ['/content-configs/math-grade4-decimal-001', '小数点灯塔 配置详情']
  ])('renders %s without blanking the screen', async (path, markerText) => {
    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText(markerText)).toBeInTheDocument();
  });

  test('redirects unknown protected routes back to the home world', async () => {
    render(
      <MemoryRouter initialEntries={['/not-a-real-page']}>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByText('点亮今天的学习星轨')).toBeInTheDocument();
  });
});
