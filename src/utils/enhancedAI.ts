
import { User, LearningModule, AssessmentResult } from '../types';
import { EnhancedUser } from '../types/enhanced';

export interface LearningStyle {
  visual: number;
  auditory: number;
  kinesthetic: number;
  reading: number;
}

export interface PersonalizationFactors {
  skillGaps: string[];
  learningPace: 'slow' | 'medium' | 'fast';
  timeConstraints: number; // minutes per day
  careerGoals: string[];
  industryFocus: string[];
}

export function detectLearningStyle(assessmentAnswers: number[], responseTime: number[]): LearningStyle {
  // Simple heuristic-based learning style detection
  const avgResponseTime = responseTime.reduce((a, b) => a + b, 0) / responseTime.length;
  
  return {
    visual: avgResponseTime > 30 ? 0.7 : 0.3, // Slower = more visual processing
    auditory: 0.5, // Default baseline
    kinesthetic: assessmentAnswers.filter(a => a > 2).length / assessmentAnswers.length, // Practical choices
    reading: avgResponseTime < 20 ? 0.8 : 0.4 // Fast readers
  };
}

export function calculateOptimalLearningPath(
  user: EnhancedUser,
  modules: LearningModule[],
  assessmentResult: AssessmentResult
): LearningModule[] {
  // Enhanced scoring algorithm
  const scoredModules = modules.map(module => ({
    module,
    score: calculateModuleScore(module, user, assessmentResult)
  }));

  // Sort by score and apply constraints
  const sortedModules = scoredModules
    .sort((a, b) => b.score - a.score)
    .map(item => item.module);

  return applyLearningConstraints(sortedModules, user);
}

function calculateModuleScore(
  module: LearningModule,
  user: EnhancedUser,
  assessment: AssessmentResult
): number {
  let score = 0;

  // Skill gap alignment (40% weight)
  const skillGapScore = assessment.weaknesses.some(weakness =>
    module.tags.some(tag => tag.toLowerCase().includes(weakness.toLowerCase()))
  ) ? 0.4 : 0;

  // Difficulty appropriateness (30% weight)
  const difficultyScore = getDifficultyScore(module.difficulty, user.skillLevel) * 0.3;

  // Time constraint fit (20% weight)
  const timeScore = (user.preferences.dailyGoalMinutes >= module.estimatedTime) ? 0.2 : 0.1;

  // Learning style preference (10% weight)
  const styleScore = getStyleScore(module, user) * 0.1;

  return score + skillGapScore + difficultyScore + timeScore + styleScore;
}

function getDifficultyScore(moduleDifficulty: string, userLevel: string): number {
  const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3 };
  const userLevelNum = difficultyMap[userLevel as keyof typeof difficultyMap];
  const moduleLevelNum = difficultyMap[moduleDifficulty as keyof typeof difficultyMap];
  
  // Optimal when module is slightly above user level
  const difference = moduleLevelNum - userLevelNum;
  if (difference === 1) return 1.0; // Perfect challenge
  if (difference === 0) return 0.8; // Same level
  if (difference === -1) return 0.6; // Slightly easy (review)
  return 0.3; // Too easy or too hard
}

function getStyleScore(module: LearningModule, user: EnhancedUser): number {
  // Simple heuristic based on module type and content
  if (module.type === 'external' && module.url?.includes('youtube')) {
    return 0.8; // Video content - good for visual/auditory learners
  }
  if (module.tags.includes('hands-on') || module.tags.includes('project')) {
    return 0.9; // Kinesthetic learning
  }
  return 0.5; // Default
}

function applyLearningConstraints(
  modules: LearningModule[],
  user: EnhancedUser
): LearningModule[] {
  const dailyMinutes = user.preferences.dailyGoalMinutes;
  const weeklyModules = user.preferences.weeklyGoalModules;
  
  // Filter modules that fit daily time constraint
  const timeFilteredModules = modules.filter(m => m.estimatedTime <= dailyMinutes * 2);
  
  // Limit to weekly goal
  return timeFilteredModules.slice(0, weeklyModules * 2);
}

export function adaptPathBasedOnProgress(
  currentPath: LearningModule[],
  completedModules: string[],
  user: EnhancedUser,
  performanceData: { moduleId: string; timeSpent: number; difficulty: number }[]
): LearningModule[] {
  // Calculate user's actual learning pace
  const avgTimePerModule = performanceData.reduce((sum, data) => sum + data.timeSpent, 0) / performanceData.length;
  const actualPace = avgTimePerModule < 60 ? 'fast' : avgTimePerModule > 120 ? 'slow' : 'medium';
  
  // Adjust difficulty based on performance
  const avgDifficultyRating = performanceData.reduce((sum, data) => sum + data.difficulty, 0) / performanceData.length;
  
  let adjustedPath = currentPath.filter(m => !completedModules.includes(m.id));
  
  if (avgDifficultyRating < 3) {
    // User finds content too easy, add more challenging modules
    adjustedPath = adjustedPath.map(m => 
      m.difficulty === 'beginner' ? { ...m, difficulty: 'intermediate' as const } : m
    );
  } else if (avgDifficultyRating > 4) {
    // User finds content too hard, add more foundational modules
    adjustedPath = adjustedPath.map(m => 
      m.difficulty === 'advanced' ? { ...m, difficulty: 'intermediate' as const } : m
    );
  }
  
  return adjustedPath;
}
