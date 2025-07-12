export interface User {
  id: string;
  email: string;
  name: string;
  track: string;
  assessmentCompleted: boolean;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  completedModules: string[];
  currentPath: LearningPath | null;
  achievements?: Achievement[];
  totalPoints?: number;
}

export interface Assessment {
  id: string;
  track: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: '3mtt-internal' | 'external';
  url?: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  tags: string[];
  source?: string;
  lastUpdated?: string;
}

export interface LearningPath {
  id: string;
  userId: string;
  track: string;
  modules: LearningModule[];
  progress: number;
  adaptationHistory: string[];
  createdAt: string;
}

export interface TrackOption {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Achievement {
  id: string;
  type: 'completion' | 'streak' | 'level-up' | 'milestone' | 'speed' | 'consistency';
  title: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: string;
}
