export type SubjectCode = 'math' | 'chinese' | 'english' | 'olympiad';

export interface SubjectSummary {
  code: SubjectCode;
  title: string;
  subtitle: string;
  color: string;
}

export interface HomeOverview {
  child: {
    nickname: string;
    streakDays: number;
    stars: number;
    title: string;
  };
  featuredWorld: string;
  todayTask: string;
  nextLevelCode: string | null;
  nextLevelTitle: string | null;
  achievementPreview: {
    unlockedCount: number;
    totalCount: number;
    nextBadgeName: string;
  };
  subjects: SubjectSummary[];
}

export interface LevelSummary {
  code: string;
  title: string;
  status: 'available' | 'recommended' | 'locked' | 'completed';
}

export interface SubjectChapter {
  code: string;
  title: string;
  subtitle: string;
  stageLabel?: string;
  levels: LevelSummary[];
}

export interface SubjectMapData {
  subjectCode: SubjectCode;
  subjectTitle: string;
  chapters: SubjectChapter[];
}

export interface LevelStep {
  id: string;
  type: string;
  prompt: string;
  activityConfigJson?: string;
  knowledgePointCode?: string;
  knowledgePointTitle?: string;
  variantCount?: number;
}

export interface LevelDetail {
  code: string;
  title: string;
  subjectTitle: string;
  description: string;
  steps: LevelStep[];
  reward: {
    stars: number;
    badgeName: string;
  };
}
