export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemStatus = 'not_started' | 'in_progress' | 'completed' | 'revision_needed';

export interface Problem {
  id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  topicId: string;
  patternId: string;
  timeComplexity: string;
  spaceComplexity: string;
  leetcodeUrl?: string;
}

export interface Pattern {
  id: string;
  title: string;
  description: string;
  problems: Problem[];
}

export interface FundamentalItem {
  id: string;
  title: string;
  description?: string;
}

export interface Topic {
  id: string;
  title: string;
  iconName: string;
  description: string;
  fundamentals: FundamentalItem[];
  patterns: Pattern[];
}

export interface UserProgress {
  completedFundamentals: Record<string, boolean>;
  completedProblems: Record<string, boolean>;
  problemStatus: Record<string, ProblemStatus>;
  revisionCounts: Record<string, number>;
  favorites: Record<string, boolean>;
  problemNotes: Record<string, string>;
  patternNotes: Record<string, string>;
  dailyStreak: number;
  lastActiveDate: string;
  activityLog: Record<string, number>; // date string YYYY-MM-DD -> number of problems solved
  currentGoal: string;
  activeTopicId: string;
  activePatternId?: string;
}

export interface Statistics {
  totalTopics: number;
  completedTopics: number;
  totalPatterns: number;
  completedPatterns: number;
  totalProblems: number;
  solvedProblems: number;
  remainingProblems: number;
  overallPercentage: number;
  easyTotal: number;
  easySolved: number;
  mediumTotal: number;
  mediumSolved: number;
  hardTotal: number;
  hardSolved: number;
  totalRevisions: number;
  totalFundamentals: number;
  completedFundamentalsCount: number;
}
