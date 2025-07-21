
// Re-export types and functions for backward compatibility
export type { AssessmentResult } from '../types/assessment';
export { analyzeAssessment } from './assessmentAnalyzer';
export { generatePersonalizedPath } from './pathGenerator';
export { adaptLearningPath } from './pathAdapter';
export { getTrackTags } from './trackTags';
