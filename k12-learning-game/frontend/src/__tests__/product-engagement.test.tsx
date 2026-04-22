import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { ContentConfigCatalog } from '../pages/ContentConfigCatalog';
import { DailyTasksPage } from '../pages/DailyTasksPage';
import { HomeWorld } from '../pages/HomeWorld';
import { LearningPathPage } from '../pages/LearningPathPage';
import { MistakeReviewPage } from '../pages/MistakeReviewPage';

describe('Product engagement surfaces', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test('home world links to daily tasks, mistake review and learning path', async () => {
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
              nextLevelCode: 'math-addition-001',
              nextLevelTitle: '糖果加加看'
            })
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );

    render(
      <MemoryRouter>
        <HomeWorld />
      </MemoryRouter>
    );

    expect(await screen.findByRole('link', { name: '每日任务' })).toHaveAttribute('href', '/daily-tasks');
    expect(screen.getByRole('link', { name: '错题本' })).toHaveAttribute('href', '/mistakes');
    expect(screen.getByRole('link', { name: '学习路径' })).toHaveAttribute('href', '/learning-path');
    expect(screen.getByText('今日待推进')).toBeInTheDocument();
    expect(screen.getByText('连续 7 天，小岛火苗正在发光')).toBeInTheDocument();
    expect(screen.getByLabelText('家长功能入口')).toBeInTheDocument();
  });

  test('home world turns today task into a completion state when mainline is done', async () => {
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
                streakDays: 8,
                totalStars: 160,
                title: '星光收藏家'
              },
              subjects: [
                { code: 'math', title: '数学岛', subtitle: '数字火花开始跳舞', accentColor: '#ff8a5b' }
              ],
              achievementPreview: {
                unlockedCount: 8,
                totalCount: 12,
                nextBadgeName: '复习小队长'
              },
              featuredWorld: '启航岛',
              todayTask: '今天已经完成主线任务，回顾一下最喜欢的关卡吧。',
              nextLevelCode: null,
              nextLevelTitle: null
            })
          } as Response;
        }

        throw new Error(`Unhandled fetch: ${url}`);
      })
    );

    render(
      <MemoryRouter>
        <HomeWorld />
      </MemoryRouter>
    );

    expect(await screen.findByText('主线已完成')).toBeInTheDocument();
    expect(screen.getByText('连续 8 天，小岛火苗正在发光')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '去学习路径看看' })).toHaveAttribute('href', '/learning-path');
  });

  test('home world shows a retry action when the overview request fails', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.endsWith('/api/home/overview') && fetchMock.mock.calls.length === 1) {
        return {
          ok: false,
          json: async () => ({})
        } as Response;
      }

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
              { code: 'math', title: '数学岛', subtitle: '数字火花开始跳舞', accentColor: '#ff8a5b' }
            ],
            achievementPreview: {
              unlockedCount: 4,
              totalCount: 12,
              nextBadgeName: '本周小冠军'
            },
            featuredWorld: '启航岛',
            todayTask: '继续挑战 10 以内加法，把今天的学习星轨再点亮一格。',
            nextLevelCode: 'math-addition-001',
            nextLevelTitle: '10 以内加法'
          })
        } as Response;
      }

      throw new Error(`Unhandled fetch: ${url}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <HomeWorld />
      </MemoryRouter>
    );

    expect(await screen.findByText('学习小岛暂时没有醒来')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '重新唤醒小岛' }));

    expect(await screen.findByText('今日待推进')).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test('daily tasks page shows task completion and target level actions', () => {
    render(
      <MemoryRouter>
        <DailyTasksPage
          data={{
            childNickname: '小星星',
            completedCount: 1,
            totalCount: 3,
            bonusStars: 5,
            tasks: [
              {
                code: 'mainline-next',
                title: '完成主线下一关',
                description: '继续挑战糖果加加看，保持今天的学习节奏。',
                taskType: '主线',
                completed: false,
                statusLabel: '待完成',
                targetLevelCode: 'math-addition-001',
                rewardText: '+2 星光',
                rewardClaimed: false,
                claimable: false
              },
              {
                code: 'mistake-review',
                title: '复习 1 个错题点',
                description: '回到糖果减法小店，把昨天错过的地方讲清楚。',
                taskType: '复习',
                completed: true,
                statusLabel: '已完成',
                targetLevelCode: 'math-subtraction-002',
                rewardText: '+1 稳定度',
                rewardClaimed: false,
                claimable: true
              }
            ]
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '小星星的每日任务' })).toBeInTheDocument();
    expect(screen.getByText('今日已完成 1 / 3 个任务')).toBeInTheDocument();
    expect(screen.getByText('全部完成可获得 5 颗奖励星星')).toBeInTheDocument();
    expect(screen.getByText('完成主线下一关')).toBeInTheDocument();
    expect(screen.getByText('已完成')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '去完成完成主线下一关' })).toHaveAttribute('href', '/levels/math-addition-001');
  });

  test('daily tasks page claims a completed reward and refreshes board state', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/api/daily-tasks/mistake-review/claim')) {
        return {
          ok: true,
          json: async () => ({
            taskCode: 'mistake-review',
            claimed: true,
            alreadyClaimed: false,
            rewardStars: 1,
            totalStars: 127,
            message: '奖励已领取，小岛又亮了一点。',
            taskBoard: {
              childNickname: '小星星',
              completedCount: 1,
              totalCount: 3,
              bonusStars: 5,
              tasks: [
                {
                  code: 'mistake-review',
                  title: '复习 1 个错题点',
                  description: '回到糖果减法小店，把昨天错过的地方讲清楚。',
                  taskType: '复习',
                  completed: true,
                  statusLabel: '已完成',
                  targetLevelCode: 'math-subtraction-002',
                  rewardText: '+1 稳定度',
                  rewardClaimed: true,
                  claimable: false
                }
              ]
            }
          })
        } as Response;
      }

      throw new Error(`Unhandled fetch: ${url} ${init?.method ?? 'GET'}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <DailyTasksPage
          data={{
            childNickname: '小星星',
            completedCount: 1,
            totalCount: 3,
            bonusStars: 5,
            tasks: [
              {
                code: 'mistake-review',
                title: '复习 1 个错题点',
                description: '回到糖果减法小店，把昨天错过的地方讲清楚。',
                taskType: '复习',
                completed: true,
                statusLabel: '已完成',
                targetLevelCode: 'math-subtraction-002',
                rewardText: '+1 稳定度',
                rewardClaimed: false,
                claimable: true
              }
            ]
          }}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: '领取复习 1 个错题点奖励' }));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/daily-tasks/mistake-review/claim'),
      expect.objectContaining({ method: 'POST' })
    );
    expect(await screen.findByText('奖励已领取，小岛又亮了一点。')).toBeInTheDocument();
    expect(screen.getByText('已领取')).toBeInTheDocument();
  });

  test('mistake review page shows review pack and mastery status', () => {
    render(
      <MemoryRouter>
        <MistakeReviewPage
          data={{
            childNickname: '小星星',
            totalMistakes: 4,
            readyToMasterCount: 1,
            items: [
              {
                levelCode: 'math-subtraction-002',
                levelTitle: '糖果减法小店',
                subjectTitle: '数学岛',
                knowledgePointTitle: '20 以内退位减法',
                mistakeCount: 3,
                masteryStatus: '需要复习',
                reviewPrompt: '先用糖果图复盘错因，再完成 1 组变式。',
                reviewSteps: ['看错题原因', '再做同类题', '答对后回到主线']
              }
            ]
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '错题本' })).toBeInTheDocument();
    expect(screen.getByText('共 4 个错题点')).toBeInTheDocument();
    expect(screen.getByText('糖果减法小店')).toBeInTheDocument();
    expect(screen.getByText('20 以内退位减法 · 错 3 次')).toBeInTheDocument();
    expect(screen.getByText('看错题原因')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '开始复习糖果减法小店' })).toHaveAttribute('href', '/levels/math-subtraction-002');
  });

  test('mistake review page submits a review result and clears mastered item', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);

      if (url.endsWith('/api/mistakes/review/math-subtraction-002/submit')) {
        return {
          ok: true,
          json: async () => ({
            levelCode: 'math-subtraction-002',
            mastered: true,
            masteryStatus: '已掌握',
            remainingMistakes: 0,
            nextAction: '太稳了，错题小屋已经把这个知识点收进掌握徽章。',
            reviewCenter: {
              childNickname: '小星星',
              totalMistakes: 0,
              readyToMasterCount: 0,
              items: []
            }
          })
        } as Response;
      }

      throw new Error(`Unhandled fetch: ${url} ${init?.method ?? 'GET'}`);
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <MemoryRouter>
        <MistakeReviewPage
          data={{
            childNickname: '小星星',
            totalMistakes: 3,
            readyToMasterCount: 1,
            items: [
              {
                levelCode: 'math-subtraction-002',
                levelTitle: '糖果减法小店',
                subjectTitle: '数学岛',
                knowledgePointTitle: '20 以内退位减法',
                mistakeCount: 3,
                masteryStatus: '需要复习',
                reviewPrompt: '先用糖果图复盘错因，再完成 1 组变式。',
                reviewSteps: ['看错题原因', '再做同类题', '答对后回到主线']
              }
            ]
          }}
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole('button', { name: '我已复习，会做了糖果减法小店' }));

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/mistakes/review/math-subtraction-002/submit'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ correctCount: 3, wrongCount: 0, durationSeconds: 120 })
      })
    );
    expect(await screen.findByText('已掌握')).toBeInTheDocument();
    expect(screen.getByText('太稳了，错题小屋已经把这个知识点收进掌握徽章。')).toBeInTheDocument();
    expect(screen.getByText('今天的小岛很平静')).toBeInTheDocument();
  });

  test('learning path page shows locked and recommended levels', () => {
    render(
      <MemoryRouter>
        <LearningPathPage
          data={{
            stageLabel: '一年级',
            completedLevels: 2,
            totalLevels: 12,
            chapters: [
              {
                subjectCode: 'math',
                subjectTitle: '数学岛',
                chapterTitle: '百数启航站',
                chapterSubtitle: '认识更大的数',
                levels: [
                  {
                    levelCode: 'math-grade1-numbers-001',
                    levelTitle: '认识 100 以内的数',
                    status: 'completed',
                    locked: false,
                    lockReason: ''
                  },
                  {
                    levelCode: 'math-grade1-addition-001',
                    levelTitle: '20 以内进位加法',
                    status: 'recommended',
                    locked: false,
                    lockReason: ''
                  },
                  {
                    levelCode: 'math-grade1-subtraction-001',
                    levelTitle: '20 以内退位减法',
                    status: 'locked',
                    locked: true,
                    lockReason: '先完成前一站，再解锁这里'
                  }
                ]
              }
            ]
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '一年级学习路径' })).toBeInTheDocument();
    expect(screen.getByText('已完成 2 / 12 关')).toBeInTheDocument();
    expect(screen.getByText('推荐下一站')).toBeInTheDocument();
    expect(screen.getByText('先完成前一站，再解锁这里')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '挑战20 以内进位加法' })).toHaveAttribute('href', '/levels/math-grade1-addition-001');
  });

  test('content config catalog shows backend-configured activity quality', () => {
    render(
      <MemoryRouter>
        <ContentConfigCatalog
          data={{
            totalLevelCount: 5,
            configuredLevelCount: 3,
            healthyLevelCount: 2,
            warningLevelCount: 1,
            configCoveragePercent: 60,
            totalVariantCount: 17,
            items: [
              {
                levelCode: 'math-grade4-decimal-001',
                levelTitle: '小数点灯塔',
                subjectTitle: '数学岛',
                knowledgePointCode: 'math.g4.decimal.tenths',
                knowledgePointTitle: '小数初步：十分位',
                variantCount: 6,
                assetTheme: '小数灯塔',
                audioQuality: '高质量儿童 TTS',
                configSource: 'backend',
                healthStatus: 'healthy',
                healthNotes: ['配置完整']
              },
              {
                levelCode: 'math-grade1-hundredchart-001',
                levelTitle: '百格图认数',
                subjectTitle: '数学岛',
                knowledgePointCode: 'math.g1.number-shape.hundred-chart',
                knowledgePointTitle: '数形结合：百格图认数',
                variantCount: 8,
                assetTheme: '待补素材主题',
                audioQuality: '待补音频质量',
                configSource: 'knowledge',
                healthStatus: 'warning',
                healthNotes: ['缺少后端玩法配置', '缺少素材主题']
              }
            ]
          }}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: '题库配置中心' })).toBeInTheDocument();
    expect(screen.getByText('已配置 3 个后端玩法关卡')).toBeInTheDocument();
    expect(screen.getByText('累计 17 组题库变体')).toBeInTheDocument();
    expect(screen.getByText('配置覆盖率 60%')).toBeInTheDocument();
    expect(screen.getByText('健康 2 个')).toBeInTheDocument();
    expect(screen.getByText('需补齐 1 个')).toBeInTheDocument();
    expect(screen.getByText('小数点灯塔')).toBeInTheDocument();
    expect(screen.getByText('百格图认数')).toBeInTheDocument();
    expect(screen.getByText('状态：健康')).toBeInTheDocument();
    expect(screen.getByText('状态：需补齐')).toBeInTheDocument();
    expect(screen.getByText('缺少后端玩法配置')).toBeInTheDocument();
    expect(screen.getByText('素材：小数灯塔')).toBeInTheDocument();
    expect(screen.getByText('音频：高质量儿童 TTS')).toBeInTheDocument();
  });
});
