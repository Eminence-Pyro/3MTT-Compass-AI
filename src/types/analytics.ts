
export interface UserAnalytics {
  userId: string;
  sessionStart: string;
  totalTimeSpent: number;
  modulesViewed: string[];
  assessmentAttempts: number;
  completionRate: number;
  learningStreak: number;
  lastActiveDate: string;
}

export interface ModuleAnalytics {
  moduleId: string;
  viewCount: number;
  averageTimeSpent: number;
  completionRate: number;
  userRatings: number[];
  difficultyFeedback: ('too-easy' | 'just-right' | 'too-hard')[];
}

export interface AssessmentAnalytics {
  questionId: string;
  totalAttempts: number;
  correctAnswers: number;
  averageTimeToAnswer: number;
  commonWrongAnswers: number[];
}
