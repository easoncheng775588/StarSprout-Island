import type { HomeOverview, LevelDetail, SubjectMapData, SubjectCode } from './types';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
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
    levels: SubjectMapData['levels'];
  }>;
}

interface CompleteLevelApiResponse {
  levelCode: string;
  reward: LevelDetail['reward'];
  message: string;
}

export interface ParentDashboardData {
  childNickname: string;
  todaySummary: {
    completedLevels: number;
    studyMinutes: number;
    earnedStars: number;
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
  recommendedActions: string[];
  settings: {
    leaderboardEnabled: boolean;
    dailyStudyMinutes: number;
  };
}

export interface LeaderboardData {
  boardType: string;
  boardTitle: string;
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
}

export interface AchievementsData {
  childNickname: string;
  unlockedCount: number;
  totalCount: number;
  unlockedBadges: AchievementBadgeData[];
  inProgressBadges: AchievementBadgeData[];
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
    featuredWorld: '启航岛',
    todayTask: '完成数字小探险，点亮今天的第一颗星。',
    achievementPreview: data.achievementPreview ?? defaultAchievementPreview,
    subjects: data.subjects.map((subject) => ({
      code: subject.code,
      title: subject.title,
      subtitle: subject.subtitle,
      color: subject.accentColor
    }))
  };
}

export async function getSubjectMap(subjectCode: SubjectCode): Promise<SubjectMapData> {
  const data = await fetchJson<SubjectMapApiResponse>(`/api/subjects/${subjectCode}/map`);
  const chapter = data.chapters[0];

  return {
    subjectCode: data.subject.code,
    chapterTitle: chapter.title,
    chapterSubtitle: chapter.subtitle,
    levels: chapter.levels
  };
}

export function getLevel(levelCode: string): Promise<LevelDetail> {
  return fetchJson<LevelDetail>(`/api/levels/${levelCode}`);
}

export async function completeLevel(levelCode: string): Promise<CompleteLevelApiResponse> {
  return fetchJson<CompleteLevelApiResponse>(`/api/levels/${levelCode}/complete`, {
    method: 'POST',
    body: JSON.stringify({
      childProfileId: 1,
      correctCount: 2,
      wrongCount: 0,
      durationSeconds: 74
    })
  });
}

export function getParentDashboard(): Promise<ParentDashboardData> {
  return fetchJson<ParentDashboardData>('/api/parent/dashboard');
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
