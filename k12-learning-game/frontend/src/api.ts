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
  knowledgeMap: Array<{
    subjectTitle: string;
    knowledgePointCode: string;
    knowledgePointTitle: string;
    masteryPercent: number;
    statusLabel: string;
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

export function getParentDashboard(): Promise<ParentDashboardData> {
  return fetchJson<ParentDashboardData>('/api/parent/dashboard');
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

export function getAchievements(): Promise<AchievementsData> {
  return fetchJson<AchievementsData>('/api/achievements');
}

export function getDailyTasks(): Promise<DailyTaskBoardData> {
  return fetchJson<DailyTaskBoardData>('/api/daily-tasks');
}

export function claimDailyTask(taskCode: string): Promise<DailyTaskClaimData> {
  return fetchJson<DailyTaskClaimData>(`/api/daily-tasks/${taskCode}/claim`, {
    method: 'POST'
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

export function getContentConfigCatalog(): Promise<ContentConfigCatalogData> {
  return fetchJson<ContentConfigCatalogData>('/api/content/configs');
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
