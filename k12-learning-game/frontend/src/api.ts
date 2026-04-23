import type { HomeOverview, LevelDetail, SubjectChapter, SubjectMapData, SubjectCode } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';
const SESSION_STORAGE_KEY = 'k12-learning-game-session';

interface StoredSession {
  parentAccountId: number;
  parentDisplayName: string;
  childProfileId: number;
  childNickname: string;
  children: SessionChildProfile[];
}

function readStoredSession(): StoredSession | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(SESSION_STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  if (rawValue === 'active') {
    return {
      parentAccountId: 1,
      parentDisplayName: '星星妈妈',
      childProfileId: 1,
      childNickname: '小星星',
      children: []
    };
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<StoredSession>;
    if (
      typeof parsed.parentAccountId === 'number'
      && typeof parsed.parentDisplayName === 'string'
      && typeof parsed.childProfileId === 'number'
      && typeof parsed.childNickname === 'string'
      && Array.isArray(parsed.children)
    ) {
      return {
        parentAccountId: parsed.parentAccountId,
        parentDisplayName: parsed.parentDisplayName,
        childProfileId: parsed.childProfileId,
        childNickname: parsed.childNickname,
        children: parsed.children as SessionChildProfile[]
      };
    }

    if (typeof parsed.childProfileId === 'number' && typeof parsed.childNickname === 'string') {
      return {
        parentAccountId: 1,
        parentDisplayName: '星星妈妈',
        childProfileId: parsed.childProfileId,
        childNickname: parsed.childNickname,
        children: []
      };
    }
  } catch {
    return null;
  }

  return null;
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const session = readStoredSession();
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (session) {
    headers.set('X-Child-Profile-Id', String(session.childProfileId));
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }

  return response.json() as Promise<T>;
}

interface HomeOverviewApiResponse {
  child: {
    id: number;
    nickname: string;
    streakDays: number;
    totalStars: number;
    title: string;
  };
  subjects: Array<{
    code: SubjectCode;
    title: string;
    subtitle: string;
    accentColor: string;
  }>;
  achievementPreview?: {
    unlockedCount: number;
    totalCount: number;
    nextBadgeName: string;
  };
  featuredWorld?: string;
  todayTask?: string;
  nextLevelCode?: string | null;
  nextLevelTitle?: string | null;
}

interface SubjectMapApiResponse {
  subject: {
    code: SubjectCode;
    title: string;
  };
  chapters: Array<{
    code: string;
    title: string;
    subtitle: string;
    levels: SubjectChapter['levels'];
  }>;
}

interface CompleteLevelApiResponse {
  levelCode: string;
  reward: LevelDetail['reward'];
  message: string;
  isFirstCompletion: boolean;
  effectiveStars: number;
  totalStars: number;
  newlyUnlockedBadges: AchievementBadgeData[];
  leaderboardFeedback: {
    boardTitle: string;
    rankBefore: number;
    rankAfter: number;
    trendLabel: string;
    message: string;
    totalStars: number;
  };
}

export interface ParentDashboardData {
  childNickname: string;
  todaySummary: {
    completedLevels: number;
    studyMinutes: number;
    earnedStars: number;
  };
  weeklyReport: {
    title: string;
    dateRangeLabel: string;
    summary: string;
    highlightText: string;
    growthFocus: string;
    parentAction: string;
    completedLevels: number;
    studyMinutes: number;
    earnedStars: number;
    averageAccuracyPercent: number;
    effectiveLearningDays: number;
    subjectHighlights: string[];
  };
  subjectProgress: Array<{
    subjectCode: string;
    subjectTitle: string;
    progressPercent: number;
  }>;
  weeklyTrend: Array<{
    dayLabel: string;
    minutes: number;
  }>;
  weakPoints: Array<{
    title: string;
    suggestion: string;
    reason: string;
  }>;
  weakPointActionPlan: Array<{
    subjectTitle: string;
    knowledgePointTitle: string;
    priorityLabel: string;
    focusReason: string;
    parentGuidance: string;
    practicePlan: string;
    targetLevelCode: string;
  }>;
  achievementSummary: {
    unlockedCount: number;
    nextMilestone: string;
  };
  goalProgress: {
    goalMinutes: number;
    completedMinutes: number;
    completionPercent: number;
  };
  recommendedActions: Array<{
    title: string;
    reason: string;
    targetSubject: string;
  }>;
  settings: {
    leaderboardEnabled: boolean;
    dailyStudyMinutes: number;
    reminderEnabled: boolean;
  };
  learningVitals: {
    totalCompletedLevels: number;
    averageAccuracyPercent: number;
    strongestSubjectTitle: string;
    averageSessionMinutes: number;
    bestLearningPeriodLabel: string;
    effectiveLearningDays: number;
  };
  subjectInsights: Array<{
    subjectCode: string;
    subjectTitle: string;
    completedLevels: number;
    totalLevels: number;
    accuracyPercent: number;
    studyMinutes: number;
    nextLevelTitle: string;
    nextLevelReason: string;
  }>;
  recentActivities: Array<{
    subjectTitle: string;
    levelTitle: string;
    completedAtLabel: string;
    earnedStars: number;
  }>;
  siblingComparisons: Array<{
    childNickname: string;
    stageLabel: string;
    completedLevels: number;
    weeklyStars: number;
    averageAccuracyPercent: number;
    activeChild: boolean;
    statusLabel: string;
  }>;
  stageReport: {
    stageLabel: string;
    completedLevels: number;
    totalLevels: number;
    completionPercent: number;
    readinessLabel: string;
    nextMilestone: string;
  };
  fluencySummary: {
    attemptCount: number;
    averageAccuracyPercent: number;
    latestStageLabel: string;
    latestAccuracyPercent: number;
    latestRecordedAtLabel: string;
    encouragement: string;
    fluencyTrend: Array<{
      dayLabel: string;
      averageAccuracyPercent: number;
      attemptCount: number;
    }>;
    stageInsights: Array<{
      stageLabel: string;
      attemptCount: number;
      averageAccuracyPercent: number;
      statusLabel: string;
      recommendation: string;
    }>;
    typeInsights: Array<{
      focusArea: string;
      focusAreaLabel: string;
      attemptCount: number;
      averageAccuracyPercent: number;
      statusLabel: string;
      recommendation: string;
    }>;
  };
  knowledgeMap: Array<{
    subjectTitle: string;
    knowledgePointCode: string;
    knowledgePointTitle: string;
    masteryPercent: number;
    statusLabel: string;
    nextAction: string;
  }>;
  thinkingModelProgress: Array<{
    modelCode: string;
    modelTitle: string;
    modelTypeLabel: string;
    completedLevels: number;
    totalLevels: number;
    progressPercent: number;
    nextAction: string;
  }>;
  mistakeReviewPlan: Array<{
    levelTitle: string;
    knowledgePointTitle: string;
    mistakeCount: number;
    reviewAction: string;
    targetLevelCode: string;
  }>;
}

export interface LeaderboardData {
  boardType: string;
  boardTitle: string;
  metricUnit: string;
  participationEnabled: boolean;
  settlementWindowLabel: string;
  updatedAtLabel: string;
  nextTargetText: string;
  myRank: {
    rank: number;
    nickname: string;
    stars: number;
    trendLabel: string;
  };
  topPlayers: Array<{
    rank: number;
    nickname: string;
    stars: number;
    trendLabel: string;
  }>;
  nearbyPlayers: Array<{
    rank: number;
    nickname: string;
    stars: number;
    trendLabel: string;
  }>;
  privacyTip: string;
}

export interface AchievementBadgeData {
  code: string;
  title: string;
  description: string;
  progressText: string;
  unlocked: boolean;
  category: string;
  rarityLabel: string;
  progressPercent: number;
  encouragement: string;
}

export interface AchievementsData {
  childNickname: string;
  unlockedCount: number;
  totalCount: number;
  currentStageLabel: string;
  stageFamilies: AchievementStageFamilyData[];
  modelBadges: AchievementBadgeData[];
  unlockedBadges: AchievementBadgeData[];
  inProgressBadges: AchievementBadgeData[];
}

export interface AchievementStageFamilyData {
  stageLabel: string;
  title: string;
  description: string;
  unlockedCount: number;
  totalCount: number;
  progressPercent: number;
  badges: AchievementBadgeData[];
}

export interface DailyTaskData {
  code: string;
  title: string;
  description: string;
  taskType: string;
  completed: boolean;
  statusLabel: string;
  targetLevelCode: string | null;
  rewardText: string;
  rewardClaimed: boolean;
  claimable: boolean;
}

export interface DailyTaskBoardData {
  childNickname: string;
  completedCount: number;
  totalCount: number;
  bonusStars: number;
  tasks: DailyTaskData[];
}

export interface DailyTaskClaimData {
  taskCode: string;
  claimed: boolean;
  alreadyClaimed: boolean;
  rewardStars: number;
  totalStars: number;
  message: string;
  taskBoard: DailyTaskBoardData;
}

export interface FluencyAttemptPayload {
  stageLabel: string;
  focusArea: string;
  totalQuestions: number;
  correctCount: number;
  durationSeconds: number;
}

export interface FluencyAttemptResultData extends FluencyAttemptPayload {
  accuracyPercent: number;
  todayAttemptCount: number;
  encouragement: string;
}

export interface MistakeReviewCardData {
  levelCode: string;
  levelTitle: string;
  subjectTitle: string;
  knowledgePointTitle: string;
  mistakeCount: number;
  masteryStatus: string;
  reviewPrompt: string;
  reviewSteps: string[];
}

export interface MistakeReviewCenterData {
  childNickname: string;
  totalMistakes: number;
  readyToMasterCount: number;
  items: MistakeReviewCardData[];
}

export interface MistakeReviewSubmitData {
  levelCode: string;
  mastered: boolean;
  masteryStatus: string;
  remainingMistakes: number;
  nextAction: string;
  reviewCenter: MistakeReviewCenterData;
}

export interface LearningPathLevelData {
  levelCode: string;
  levelTitle: string;
  status: 'completed' | 'recommended' | 'available' | 'locked';
  locked: boolean;
  lockReason: string;
}

export interface LearningPathChapterData {
  subjectCode: SubjectCode;
  subjectTitle: string;
  chapterTitle: string;
  chapterSubtitle: string;
  levels: LearningPathLevelData[];
}

export interface LearningPathData {
  stageLabel: string;
  completedLevels: number;
  totalLevels: number;
  chapters: LearningPathChapterData[];
}

export interface ContentConfigItemData {
  levelCode: string;
  levelTitle: string;
  subjectTitle: string;
  knowledgePointCode: string;
  knowledgePointTitle: string;
  variantCount: number;
  assetTheme: string;
  audioQuality: string;
  configSource: string;
  healthStatus: 'healthy' | 'warning';
  healthNotes: string[];
}

export interface ContentConfigCatalogData {
  totalLevelCount: number;
  configuredLevelCount: number;
  healthyLevelCount: number;
  warningLevelCount: number;
  configCoveragePercent: number;
  totalVariantCount: number;
  items: ContentConfigItemData[];
}

export interface SessionChildProfile {
  id: number;
  nickname: string;
  streakDays: number;
  totalStars: number;
  title: string;
  stageLabel?: string;
  avatarColor?: string;
}

interface SessionChildrenApiResponse {
  defaultChildId: number;
  children: SessionChildProfile[];
}

export interface AuthSessionData {
  parentAccountId: number;
  parentDisplayName: string;
  defaultChildId: number;
  children: SessionChildProfile[];
}

export interface ParentRegisterPayload {
  displayName: string;
  phone: string;
  password: string;
}

export interface ChildProfileUpsertPayload {
  nickname: string;
  title: string;
  stageLabel: string;
  avatarColor: string;
}

export interface ParentSettingsPayload {
  leaderboardEnabled: boolean;
  dailyStudyMinutes: number;
  reminderEnabled: boolean;
}

const defaultFluencyTrendLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const defaultAchievementPreview = {
  unlockedCount: 0,
  totalCount: 10,
  nextBadgeName: '继续加油章'
};

export async function getHomeOverview(): Promise<HomeOverview> {
  const data = await fetchJson<HomeOverviewApiResponse>('/api/home/overview');

  return {
    child: {
      nickname: data.child.nickname,
      streakDays: data.child.streakDays,
      stars: data.child.totalStars,
      title: data.child.title
    },
    featuredWorld: data.featuredWorld ?? '启航岛',
    todayTask: data.todayTask ?? '完成数字小探险，点亮今天的第一颗星。',
    nextLevelCode: data.nextLevelCode ?? null,
    nextLevelTitle: data.nextLevelTitle ?? null,
    achievementPreview: data.achievementPreview ?? defaultAchievementPreview,
    subjects: data.subjects
      .filter((subject) => subject.code !== 'olympiad')
      .map((subject) => ({
        code: subject.code,
        title: subject.title,
        subtitle: subject.subtitle,
        color: subject.accentColor
      }))
  };
}

export async function getSubjectMap(subjectCode: SubjectCode): Promise<SubjectMapData> {
  const data = await fetchJson<SubjectMapApiResponse>(`/api/subjects/${subjectCode}/map`);

  return {
    subjectCode: data.subject.code,
    subjectTitle: data.subject.title,
    chapters: data.chapters.map((chapter) => ({
      code: chapter.code,
      title: chapter.title,
      subtitle: chapter.subtitle,
      levels: chapter.levels
    }))
  };
}

export function getLevel(levelCode: string): Promise<LevelDetail> {
  return fetchJson<LevelDetail>(`/api/levels/${levelCode}`);
}

export async function completeLevel(
  levelCode: string,
  payload: { correctCount: number; wrongCount: number; durationSeconds: number }
): Promise<CompleteLevelApiResponse> {
  const session = readStoredSession();
  const data = await fetchJson<Partial<CompleteLevelApiResponse> & Pick<CompleteLevelApiResponse, 'levelCode' | 'reward' | 'message'>>(`/api/levels/${levelCode}/complete`, {
    method: 'POST',
    body: JSON.stringify({
      childProfileId: session?.childProfileId ?? 1,
      correctCount: payload.correctCount,
      wrongCount: payload.wrongCount,
      durationSeconds: payload.durationSeconds
    })
  });

  return {
    levelCode: data.levelCode,
    reward: data.reward,
    message: data.message,
    isFirstCompletion: data.isFirstCompletion ?? true,
    effectiveStars: data.effectiveStars ?? data.reward.stars,
    totalStars: data.totalStars ?? data.reward.stars,
    newlyUnlockedBadges: data.newlyUnlockedBadges ?? [],
    leaderboardFeedback: data.leaderboardFeedback ?? {
      boardTitle: '本周星星榜',
      rankBefore: 0,
      rankAfter: 0,
      trendLabel: '榜单已更新',
      message: '星光榜已经记录这次闯关。',
      totalStars: data.totalStars ?? data.reward.stars
    }
  };
}

export function normalizeParentDashboardData(data: Partial<ParentDashboardData> & { childNickname: string }): ParentDashboardData {
  const todaySummary = data.todaySummary ?? { completedLevels: 0, studyMinutes: 0, earnedStars: 0 };
  const learningVitals = data.learningVitals ?? {
    totalCompletedLevels: 0,
    averageAccuracyPercent: 0,
    strongestSubjectTitle: '学习小岛',
    averageSessionMinutes: 0,
    bestLearningPeriodLabel: '暂无记录',
    effectiveLearningDays: 0
  };
  const fluencyTrend = Array.isArray(data.fluencySummary?.fluencyTrend) && data.fluencySummary.fluencyTrend.length > 0
    ? data.fluencySummary.fluencyTrend.map((point, index) => ({
      dayLabel: point.dayLabel || defaultFluencyTrendLabels[index] || `第${index + 1}天`,
      averageAccuracyPercent: typeof point.averageAccuracyPercent === 'number' ? point.averageAccuracyPercent : 0,
      attemptCount: typeof point.attemptCount === 'number' ? point.attemptCount : 0
    }))
    : defaultFluencyTrendLabels.map((dayLabel) => ({
      dayLabel,
      averageAccuracyPercent: 0,
      attemptCount: 0
    }));
  const weeklyReport = data.weeklyReport;
  const defaultWeeklyReport = {
    title: `${data.childNickname} 的本周成长周报`,
    dateRangeLabel: '暂无周报周期',
    summary: '暂无可展示的周报数据，完成更多关卡后会自动生成。',
    highlightText: '先完成几次学习挑战，系统会自动整理本周亮点。',
    growthFocus: '继续保持轻松节奏，优先完成当前推荐关卡。',
    parentAction: '可以陪孩子复盘今天最喜欢的一关，鼓励他说出自己的思路。',
    completedLevels: todaySummary.completedLevels,
    studyMinutes: todaySummary.studyMinutes,
    earnedStars: todaySummary.earnedStars,
    averageAccuracyPercent: learningVitals.averageAccuracyPercent,
    effectiveLearningDays: learningVitals.effectiveLearningDays,
    subjectHighlights: [] as string[]
  };

  return {
    childNickname: data.childNickname,
    todaySummary,
    weeklyReport: {
      title: weeklyReport?.title ?? defaultWeeklyReport.title,
      dateRangeLabel: weeklyReport?.dateRangeLabel ?? defaultWeeklyReport.dateRangeLabel,
      summary: weeklyReport?.summary ?? defaultWeeklyReport.summary,
      highlightText: weeklyReport?.highlightText ?? defaultWeeklyReport.highlightText,
      growthFocus: weeklyReport?.growthFocus ?? defaultWeeklyReport.growthFocus,
      parentAction: weeklyReport?.parentAction ?? defaultWeeklyReport.parentAction,
      completedLevels: weeklyReport?.completedLevels ?? defaultWeeklyReport.completedLevels,
      studyMinutes: weeklyReport?.studyMinutes ?? defaultWeeklyReport.studyMinutes,
      earnedStars: weeklyReport?.earnedStars ?? defaultWeeklyReport.earnedStars,
      averageAccuracyPercent: weeklyReport?.averageAccuracyPercent ?? defaultWeeklyReport.averageAccuracyPercent,
      effectiveLearningDays: weeklyReport?.effectiveLearningDays ?? defaultWeeklyReport.effectiveLearningDays,
      subjectHighlights: weeklyReport?.subjectHighlights ?? defaultWeeklyReport.subjectHighlights
    },
    subjectProgress: data.subjectProgress ?? [],
    weeklyTrend: data.weeklyTrend ?? [],
    weakPoints: data.weakPoints ?? [],
    weakPointActionPlan: data.weakPointActionPlan ?? [],
    achievementSummary: data.achievementSummary ?? {
      unlockedCount: 0,
      nextMilestone: '完成更多关卡后会生成下一枚成就目标。'
    },
    goalProgress: data.goalProgress ?? {
      goalMinutes: data.settings?.dailyStudyMinutes ?? 20,
      completedMinutes: todaySummary.studyMinutes,
      completionPercent: 0
    },
    recommendedActions: data.recommendedActions ?? [],
    settings: data.settings ?? {
      leaderboardEnabled: true,
      dailyStudyMinutes: 20,
      reminderEnabled: false
    },
    learningVitals,
    subjectInsights: data.subjectInsights ?? [],
    recentActivities: data.recentActivities ?? [],
    siblingComparisons: data.siblingComparisons ?? [],
    stageReport: data.stageReport ?? {
      stageLabel: '当前学段',
      completedLevels: learningVitals.totalCompletedLevels,
      totalLevels: learningVitals.totalCompletedLevels,
      completionPercent: learningVitals.totalCompletedLevels > 0 ? 100 : 0,
      readinessLabel: '继续探索',
      nextMilestone: '完成更多关卡后会生成阶段建议。'
    },
    fluencySummary: {
      attemptCount: data.fluencySummary?.attemptCount ?? 0,
      averageAccuracyPercent: data.fluencySummary?.averageAccuracyPercent ?? 0,
      latestStageLabel: data.fluencySummary?.latestStageLabel ?? '当前学段',
      latestAccuracyPercent: data.fluencySummary?.latestAccuracyPercent ?? 0,
      latestRecordedAtLabel: data.fluencySummary?.latestRecordedAtLabel ?? '',
      encouragement: data.fluencySummary?.encouragement ?? '本周还没有开始数感快练，可以先用 1 分钟热热身。',
      fluencyTrend,
      stageInsights: data.fluencySummary?.stageInsights ?? [],
      typeInsights: data.fluencySummary?.typeInsights ?? []
    },
    knowledgeMap: data.knowledgeMap ?? [],
    thinkingModelProgress: data.thinkingModelProgress ?? [],
    mistakeReviewPlan: data.mistakeReviewPlan ?? []
  };
}

export function normalizeAchievementsData(data: Partial<AchievementsData> & { childNickname: string }): AchievementsData {
  const unlockedBadges = data.unlockedBadges ?? [];
  const inProgressBadges = data.inProgressBadges ?? [];
  const modelBadges = data.modelBadges ?? [];

  return {
    childNickname: data.childNickname,
    unlockedCount: data.unlockedCount ?? unlockedBadges.length,
    totalCount: data.totalCount ?? unlockedBadges.length + inProgressBadges.length + modelBadges.length,
    currentStageLabel: data.currentStageLabel ?? '当前学段',
    stageFamilies: data.stageFamilies ?? [],
    modelBadges,
    unlockedBadges,
    inProgressBadges
  };
}

function getContentConfigHealthNotes(item: Partial<ContentConfigItemData>): string[] {
  if (Array.isArray(item.healthNotes)) {
    return item.healthNotes;
  }

  const notes: string[] = [];
  if (!item.assetTheme || item.assetTheme.includes('待补')) {
    notes.push('素材主题待补齐');
  }
  if (!item.audioQuality || item.audioQuality.includes('待补')) {
    notes.push('音频质量待补齐');
  }

  return notes.length > 0 ? notes : ['配置完整'];
}

export function normalizeContentConfigCatalogData(data: Partial<ContentConfigCatalogData>): ContentConfigCatalogData {
  const items = (data.items ?? []).map((item) => {
    const healthNotes = getContentConfigHealthNotes(item);
    const healthStatus = item.healthStatus ?? (healthNotes.some((note) => note.includes('待补')) ? 'warning' : 'healthy');

    return {
      levelCode: item.levelCode ?? 'unknown-level',
      levelTitle: item.levelTitle ?? '未命名关卡',
      subjectTitle: item.subjectTitle ?? '未分类学科',
      knowledgePointCode: item.knowledgePointCode ?? item.levelCode ?? 'unknown-knowledge-point',
      knowledgePointTitle: item.knowledgePointTitle ?? '未命名知识点',
      variantCount: item.variantCount ?? 0,
      assetTheme: item.assetTheme ?? '待补素材主题',
      audioQuality: item.audioQuality ?? '待补音频质量',
      configSource: item.configSource ?? 'unknown',
      healthStatus,
      healthNotes
    };
  });
  const totalLevelCount = data.totalLevelCount ?? Math.max(items.length, data.configuredLevelCount ?? 0);
  const configuredLevelCount = data.configuredLevelCount ?? items.length;
  const healthyLevelCount = data.healthyLevelCount ?? items.filter((item) => item.healthStatus === 'healthy').length;
  const warningLevelCount = data.warningLevelCount ?? items.filter((item) => item.healthStatus === 'warning').length;

  return {
    totalLevelCount,
    configuredLevelCount,
    healthyLevelCount,
    warningLevelCount,
    configCoveragePercent: data.configCoveragePercent ?? (totalLevelCount === 0 ? 0 : Math.round((configuredLevelCount * 100) / totalLevelCount)),
    totalVariantCount: data.totalVariantCount ?? items.reduce((sum, item) => sum + item.variantCount, 0),
    items
  };
}

export async function getParentDashboard(): Promise<ParentDashboardData> {
  const data = await fetchJson<ParentDashboardData>('/api/parent/dashboard');
  return normalizeParentDashboardData(data);
}

export function updateParentSettings(payload: ParentSettingsPayload): Promise<ParentSettingsPayload> {
  return fetchJson<ParentSettingsPayload>('/api/parent/settings', {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function getLeaderboard(boardType: string): Promise<LeaderboardData> {
  return fetchJson<LeaderboardData>(`/api/leaderboard/${boardType}`);
}

export function getWeeklyLeaderboard(): Promise<LeaderboardData> {
  return getLeaderboard('weekly_star');
}

export async function getAchievements(): Promise<AchievementsData> {
  const data = await fetchJson<AchievementsData>('/api/achievements');
  return normalizeAchievementsData(data);
}

export function getDailyTasks(): Promise<DailyTaskBoardData> {
  return fetchJson<DailyTaskBoardData>('/api/daily-tasks');
}

export function claimDailyTask(taskCode: string): Promise<DailyTaskClaimData> {
  return fetchJson<DailyTaskClaimData>(`/api/daily-tasks/${taskCode}/claim`, {
    method: 'POST'
  });
}

export function recordFluencyAttempt(payload: FluencyAttemptPayload): Promise<FluencyAttemptResultData> {
  return fetchJson<FluencyAttemptResultData>('/api/fluency/attempts', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getMistakeReviewCenter(): Promise<MistakeReviewCenterData> {
  return fetchJson<MistakeReviewCenterData>('/api/mistakes/review');
}

export function submitMistakeReview(
  levelCode: string,
  payload: { correctCount: number; wrongCount: number; durationSeconds: number }
): Promise<MistakeReviewSubmitData> {
  return fetchJson<MistakeReviewSubmitData>(`/api/mistakes/review/${levelCode}/submit`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getLearningPath(): Promise<LearningPathData> {
  return fetchJson<LearningPathData>('/api/learning-path');
}

export async function getContentConfigCatalog(): Promise<ContentConfigCatalogData> {
  const data = await fetchJson<ContentConfigCatalogData>('/api/content/configs');
  return normalizeContentConfigCatalogData(data);
}

export function getSessionChildren(): Promise<SessionChildrenApiResponse> {
  return fetchJson<SessionChildrenApiResponse>('/api/session/children');
}

export function loginParent(phone: string, password: string): Promise<AuthSessionData> {
  return fetchJson<AuthSessionData>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password })
  });
}

export function registerParent(payload: ParentRegisterPayload): Promise<AuthSessionData> {
  return fetchJson<AuthSessionData>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function createChildProfile(
  parentAccountId: number,
  payload: ChildProfileUpsertPayload
): Promise<SessionChildProfile> {
  return fetchJson<SessionChildProfile>('/api/parent/children', {
    method: 'POST',
    headers: {
      'X-Parent-Account-Id': String(parentAccountId)
    },
    body: JSON.stringify(payload)
  });
}

export function updateChildProfile(
  parentAccountId: number,
  childProfileId: number,
  payload: ChildProfileUpsertPayload
): Promise<SessionChildProfile> {
  return fetchJson<SessionChildProfile>(`/api/parent/children/${childProfileId}`, {
    method: 'PATCH',
    headers: {
      'X-Parent-Account-Id': String(parentAccountId)
    },
    body: JSON.stringify(payload)
  });
}

export function updateParentActiveChild(
  parentAccountId: number,
  childProfileId: number
): Promise<AuthSessionData> {
  return fetchJson<AuthSessionData>('/api/parent/active-child', {
    method: 'PATCH',
    headers: {
      'X-Parent-Account-Id': String(parentAccountId)
    },
    body: JSON.stringify({ childProfileId })
  });
}
