
import { User, LearningModule, Question } from './index';

export interface EnhancedUser extends User {
  analytics: {
    totalTimeSpent: number;
    learningStreak: number;
    lastActiveDate: string;
    preferredLearningTime: 'morning' | 'afternoon' | 'evening';
  };
  preferences: {
    dailyGoalMinutes: number;
    weeklyGoalModules: number;
    reminderEnabled: boolean;
    difficultyPreference: 'challenge-me' | 'steady-pace' | 'easy-going';
  };
}

export interface EnhancedAssessment {
  id: string;
  track: string;
  questions: EnhancedQuestion[];
  adaptiveSettings: {
    minQuestions: number;
    maxQuestions: number;
    passThreshold: number;
  };
}

export interface EnhancedQuestion extends Question {
  metadata: {
    averageDifficulty: number;
    timeToAnswer: number;
    successRate: number;
  };
  tags: string[];
  explanation?: string;
}
