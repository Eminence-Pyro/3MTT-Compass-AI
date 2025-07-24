import {
  AIMessage,
  ChatSession,
  SmartRecommendation,
  SearchResult,
  UserInsight,
  DocumentAnalysis,
  ContentGeneration,
  PredictiveAnalytics
} from '../types/ai';

import { User, LearningModule } from '../types/index';
// If apiService is needed, uncomment below
// import { apiService } from './apiService';

// Placeholder for localStorageService (implement or import as needed)
const localStorageService = {
  getUserById: (id: string) => {
    const userJson = localStorage.getItem(`user_${id}`);
    return userJson ? JSON.parse(userJson) : null;
  }
};

class AIService {
  private apiKey: string = 'demo-key';
  private baseUrl: string = 'https://api.openai.com/v1'; // mock

  async sendMessage(sessionId: string, message: string, context: any): Promise<AIMessage> {
    const { currentTrack, skillLevel, completedModules } = context || {};
    let response = "";

    if (/youtube|video|external/i.test(message)) {
      response = "Here are some top YouTube resources for your track. Would you like a video recommendation?";
    } else if (/course|module|learn/i.test(message)) {
      response = `Based on your interest in ${currentTrack || "your track"}, I recommend starting with the official 3MTT course.`;
    } else if (/struggle|difficult|help/i.test(message)) {
      response = "It looks like you're facing challenges. Would you like tips, peer support, or extra materials?";
    } else if (skillLevel === 'beginner' && completedModules?.length > 5) {
      response = "Great progress! You might be ready to try intermediate modules.";
    } else {
      response = "Keep up the good work! Let me know if you want recommendations, analytics, or help with a specific topic.";
    }

    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      metadata: { type: 'guidance', confidence: 0.92 }
    };
  }

  async generateRecommendations(user: User, behaviorData: any): Promise<SmartRecommendation[]> {
    const recommendations: SmartRecommendation[] = [];

    if (user.track && user.skillLevel) {
      recommendations.push({
        id: 'rec_personalized',
        type: 'module',
        title: `Personalized ${user.track} Module`,
        description: `Recommended for your ${user.skillLevel} level in the ${user.track} track.`,
        confidence: 0.97,
        reasoning: 'Based on track and skill level',
        actionUrl: `/dashboard/${user.track}`,
        metadata: {
          estimatedTime: 45,
          difficulty: user.skillLevel,
          tags: [user.track, user.skillLevel]
        }
      });
    }

    if (user.track) {
      recommendations.push({
        id: 'rec_youtube_dynamic',
        type: 'resource',
        title: `YouTube: Top ${user.track} Tutorials`,
        description: `Curated YouTube playlist for ${user.track} learners.`,
        confidence: 0.91,
        reasoning: 'External match to track',
        actionUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(user.track + " tutorial")}`,
        metadata: {
          estimatedTime: 60,
          difficulty: user.skillLevel,
          tags: ['youtube', user.track, 'video']
        }
      });
    }

    recommendations.push({
      id: 'rec_3mtt_course',
      type: 'module',
      title: '3MTT Official: Fullstack Foundations',
      description: 'Start with the official 3MTT Fullstack Foundations course.',
      confidence: 0.98,
      reasoning: 'Recommended for new learners',
      actionUrl: 'https://app.3mtt.training/courses/fullstack-foundations',
      metadata: {
        estimatedTime: 120,
        difficulty: 'beginner',
        tags: ['3mtt', 'fullstack', 'official']
      }
    });

    recommendations.push({
      id: 'rec_youtube_js',
      type: 'resource',
      title: 'YouTube: JavaScript Crash Course',
      description: 'Watch this YouTube video to quickly learn JavaScript basics.',
      confidence: 0.93,
      reasoning: 'Popular beginner resource',
      actionUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
      metadata: {
        estimatedTime: 60,
        difficulty: 'beginner',
        tags: ['youtube', 'javascript', 'video']
      }
    });

    if (user.completedModules.length === 0) {
      recommendations.push({
        id: 'rec_start',
        type: 'action',
        title: 'Start Your First Module',
        description: 'Begin your learning journey with foundational concepts.',
        confidence: 0.95,
        reasoning: 'New user start recommendation',
        actionUrl: '/dashboard'
      });
    }

    if (user.completedModules.length > 0 && user.completedModules.length < 3) {
      recommendations.push({
        id: 'rec_continue',
        type: 'module',
        title: 'Continue Learning Momentum',
        description: 'Your next module is ready!',
        confidence: 0.88,
        reasoning: 'Reinforce consistent learning',
        metadata: {
          estimatedTime: 30,
          difficulty: user.skillLevel
        }
      });
    }

    if (user.skillLevel === 'beginner' && user.completedModules.length >= 5) {
      recommendations.push({
        id: 'rec_level_up',
        type: 'action',
        title: 'Ready for Intermediate Level?',
        description: 'Consider advancing to intermediate content.',
        confidence: 0.75,
        reasoning: 'Strong beginner performance',
        actionUrl: '/assessment'
      });
    }

    return recommendations;
  }

  async semanticSearch(query: string, context: any): Promise<SearchResult[]> {
    const mockResults: SearchResult[] = [
      {
        id: 'search_1',
        title: 'JavaScript Fundamentals',
        content: 'Learn JS basics like variables, functions, and control flow.',
        type: 'module',
        relevanceScore: 0.92,
        metadata: {
          track: 'fullstack',
          difficulty: 'beginner',
          estimatedTime: 120
        }
      },
      {
        id: 'search_2',
        title: 'React Components',
        content: 'Understand React components, props, and state.',
        type: 'module',
        relevanceScore: 0.87,
        metadata: {
          track: 'fullstack',
          difficulty: 'intermediate',
          estimatedTime: 180
        }
      }
    ];

    const queryLower = query.toLowerCase();
    return mockResults
      .filter(result => result.title.toLowerCase().includes(queryLower) || result.content.toLowerCase().includes(queryLower))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  async generateInsights(user: User, activityData: any): Promise<UserInsight[]> {
    const insights: UserInsight[] = [];
    const storedUser = localStorageService.getUserById(user.id);
    if (!storedUser) return insights;

    const completionRate = user.currentPath
      ? (user.completedModules.length / user.currentPath.modules.length) * 100
      : 0;

    insights.push({
      id: 'insight_progress',
      type: 'progress',
      title: 'Learning Progress',
      description: `You've completed ${completionRate.toFixed(1)}% of your learning path`,
      value: `${completionRate.toFixed(1)}%`,
      trend: completionRate > 50 ? 'up' : 'stable',
      actionable: completionRate < 30,
      priority: completionRate < 30 ? 'high' : 'medium'
    });

    if (user.completedModules.length >= 3) {
      insights.push({
        id: 'insight_performance',
        type: 'performance',
        title: 'Learning Velocity',
        description: 'You’re learning consistently.',
        value: 'Good',
        trend: 'up',
        actionable: false,
        priority: 'low'
      });
    }

    if (user.skillLevel === 'beginner' && user.completedModules.length >= 5) {
      insights.push({
        id: 'insight_recommendation',
        type: 'recommendation',
        title: 'Skill Level Assessment',
        description: 'You may be ready for intermediate content.',
        value: 'Action Required',
        actionable: true,
        priority: 'high'
      });
    }

    return insights;
  }

  async analyzeDocument(file: File): Promise<DocumentAnalysis> {
    return {
      id: `doc_${Date.now()}`,
      fileName: file.name,
      type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'text',
      extractedText: 'Mock extracted text...',
      summary: 'Document contains web development learning materials.',
      tags: ['web-development', 'javascript', 'tutorial'],
      entities: [
        { type: 'technology', value: 'JavaScript', confidence: 0.95 },
        { type: 'concept', value: 'Functions', confidence: 0.88 }
      ],
      insights: ['Beginner-level content', 'Fullstack relevance', 'Estimated reading time: 15 minutes']
    };
  }

  async generateContent(
    type: ContentGeneration['type'],
    prompt: string,
    parameters: ContentGeneration['parameters']
  ): Promise<ContentGeneration> {
    const mockContent = {
      report: `# Progress Report\n\nYou're making excellent progress in ${prompt}.`,
      summary: `## Summary\n\nThis ${prompt} covers key topics and applications.`,
      post: `🎉 Another milestone unlocked in ${prompt}! #Learning`,
      plan: `# Learning Plan for ${prompt}\n\nWeek 1: Basics\nWeek 2: Practice\nWeek 3: Advanced\n`
    };

    return {
      type,
      prompt,
      parameters,
      result: mockContent[type] || 'Generated content here.',
      metadata: {
        wordCount: mockContent[type]?.split(' ').length || 0,
        generatedAt: new Date().toISOString(),
        model: 'gpt-3.5-turbo'
      }
    };
  }

  async generatePredictions(user: User, historicalData: any): Promise<PredictiveAnalytics> {
    const currentProgress = user.currentPath
      ? user.completedModules.length / user.currentPath.modules.length
      : 0;

    const remainingModules = user.currentPath
      ? user.currentPath.modules.length - user.completedModules.length
      : 0;

    const estimatedDays = remainingModules * 3;
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDays);

    return {
      userId: user.id,
      predictions: {
        completionDate: completionDate.toISOString(),
        successProbability: Math.min(0.95, 0.6 + currentProgress * 0.3),
        recommendedPace: currentProgress > 0.7 ? 'normal' : currentProgress > 0.3 ? 'normal' : 'slow',
        riskFactors: currentProgress < 0.2 ? ['Low engagement', 'Slow progress'] : [],
        opportunities: ['Peer collaboration', 'Advanced modules', 'Certification preparation']
      },
      trends: {
        learningVelocity: [0.2, 0.4, 0.6, 0.8, 1.0],
        engagementScore: [0.7, 0.8, 0.75, 0.9],
        difficultyProgression: [0.3, 0.4, 0.5, 0.6]
      },
      forecasts: {
        nextWeekActivity: Math.floor(Math.random() * 5) + 3,
        monthlyProgress: Math.min(100, currentProgress * 100 + 25),
        skillLevelProgression: user.skillLevel === 'beginner' ? 'intermediate' : 'advanced'
      }
    };
  }
}

export const aiService = new AIService();
