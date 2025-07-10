
export interface AssessmentResult {
  score: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
}
