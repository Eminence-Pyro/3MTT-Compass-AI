export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: {
    type?: 'onboarding' | 'guidance' | 'faq' | 'recommendation';
    confidence?: number;
    sources?: string[];
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: AIMessage[];
  context: {
    currentTrack?: string;
    skillLevel?: string;
    currentModule?: string;
    recentActivity?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface SmartRecommendation {
  id: string;
  type: 'module' | 'track' | 'action' | 'resource';
  title: string;
  description: string;
  confidence: number;
  reasoning: string;
  actionUrl?: string;
  metadata?: {
    estimatedTime?: number;
    difficulty?: string;
    tags?: string[];
  };
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: 'module' | 'track' | 'resource' | 'faq';
  relevanceScore: number;
  metadata?: {
    track?: string;
    difficulty?: string;
    estimatedTime?: number;
    source?: string;
  };
}

export interface UserInsight {
  id: string;
  type: 'progress' | 'performance' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  value: string | number;
  trend?: 'up' | 'down' | 'stable';
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface DocumentAnalysis {
  id: string;
  fileName: string;
  type: 'pdf' | 'image' | 'text';
  extractedText: string;
  summary: string;
  tags: string[];
  entities: {
    type: string;
    value: string;
    confidence: number;
  }[];
  insights: string[];
}

export interface ContentGeneration {
  type: 'report' | 'summary' | 'post' | 'plan';
  prompt: string;
  parameters: {
    tone?: 'professional' | 'casual' | 'academic';
    length?: 'short' | 'medium' | 'long';
    format?: 'markdown' | 'html' | 'plain';
    includeData?: boolean;
  };
  result: string;
  metadata: {
    wordCount: number;
    generatedAt: string;
    model: string;
  };
}

export interface PredictiveAnalytics {
  userId: string;
  predictions: {
    completionDate: string;
    successProbability: number;
    recommendedPace: 'slow' | 'normal' | 'fast';
    riskFactors: string[];
    opportunities: string[];
  };
  trends: {
    learningVelocity: number[];
    engagementScore: number[];
    difficultyProgression: number[];
  };
  forecasts: {
    nextWeekActivity: number;
    monthlyProgress: number;
    skillLevelProgression: string;
  };
}

export interface AccessibilityFeatures {
  translation: {
    enabled: boolean;
    targetLanguage: string;
    confidence: number;
  };
  transcription: {
    enabled: boolean;
    language: string;
    accuracy: number;
  };
  voiceInteraction: {
    enabled: boolean;
    wakeWord: string;
    voiceProfile?: string;
  };
}