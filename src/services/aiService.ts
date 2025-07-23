import { AIMessage, ChatSession, SmartRecommendation, SearchResult, UserInsight, DocumentAnalysis, ContentGeneration, PredictiveAnalytics } from '../types/ai';
import { User, LearningModule } from '../types/index';

class AIService {
  private apiKey: string = 'demo-key'; // In production, use environment variables
  private baseUrl: string = 'https://api.openai.com/v1'; // Mock for demo

  // Conversational AI Layer
  async sendMessage(sessionId: string, message: string, context: any): Promise<AIMessage> {
    // Smarter AI response using context and message analysis
    const { currentTrack, skillLevel, completedModules, recentActivity } = context || {};
    let response = "";

    if (/youtube|video|external/i.test(message)) {
      response = "Here are some top YouTube resources for your track. Would you like a video recommendation?";
    } else if (/course|module|learn/i.test(message)) {
      response = `Based on your interest in ${currentTrack || "your track"}, I recommend starting with the official 3MTT course and supplementing with external resources.`;
    } else if (/struggle|difficult|help/i.test(message)) {
      response = "It looks like you're facing challenges. Would you like tips, peer support, or extra materials?";
    } else if (skillLevel === 'beginner' && completedModules && completedModules.length > 5) {
      response = "Great progress! You might be ready to try intermediate modules or retake the assessment.";
    } else {
      response = "Keep up the good work! Let me know if you want recommendations, analytics, or help with a specific topic.";
    }

    return {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString(),
      metadata: {
        type: 'guidance',
        confidence: 0.92
      }
    };
  }

  // Smart Recommendations
  async generateRecommendations(user: User, behaviorData: any): Promise<SmartRecommendation[]> {
    const recommendations: SmartRecommendation[] = [];

    // Use user context for smarter recommendations
    if (user.track && user.skillLevel) {
      recommendations.push({
        id: 'rec_personalized',
        type: 'module',
        title: `Personalized ${user.track} Module`,
        description: `Recommended for your ${user.skillLevel} level in the ${user.track} track.`,
        confidence: 0.97,
        reasoning: 'Personalized based on track and skill level',
        actionUrl: `/dashboard/${user.track}`,
        metadata: {
          estimatedTime: 45,
          difficulty: user.skillLevel,
          tags: [user.track, user.skillLevel]
        }
      });
    }

    // External resource matching (YouTube search based on track)
    if (user.track) {
      recommendations.push({
        id: 'rec_youtube_dynamic',
        type: 'resource',
        title: `YouTube: Top ${user.track} Tutorials`,
        description: `Curated YouTube playlist for ${user.track} learners.`,
        confidence: 0.91,
        reasoning: 'Matched external resources to user track',
        actionUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(user.track + " tutorial")}`,
        metadata: {
          estimatedTime: 60,
          difficulty: user.skillLevel,
          tags: ['youtube', user.track, 'video']
        }
      });
    }

    // 3MTT Portal Course Example
    recommendations.push({
      id: 'rec_3mtt_course',
      type: 'module',
      title: '3MTT Official: Fullstack Foundations',
      description: 'Start with the official 3MTT Fullstack Foundations course to build your core skills.',
      confidence: 0.98,
      reasoning: 'Recommended by 3MTT portal for new learners',
      actionUrl: 'https://app.3mtt.training/courses/fullstack-foundations',
      metadata: {
        estimatedTime: 120,
        difficulty: 'beginner',
        tags: ['3mtt', 'fullstack', 'official']
      }
    });

    // External Source (YouTube) Example
    recommendations.push({
      id: 'rec_youtube_js',
      type: 'resource',
      title: 'YouTube: JavaScript Crash Course',
      description: 'Watch this YouTube video to quickly learn JavaScript basics.',
      confidence: 0.93,
      reasoning: 'Popular external resource for beginners',
      actionUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
      metadata: {
        estimatedTime: 60,
        difficulty: 'beginner',
        tags: ['youtube', 'javascript', 'video']
      }
    });

    // Mock recommendations based on user data
    if (user.completedModules.length === 0) {
      recommendations.push({
        id: 'rec_start',
        type: 'action',
        title: 'Start Your First Module',
        description: 'Begin your learning journey with the foundational concepts in your track.',
        confidence: 0.95,
        reasoning: 'New users benefit from starting with basics',
        actionUrl: '/dashboard'
      });
    }

    if (user.completedModules.length > 0 && user.completedModules.length < 3) {
      recommendations.push({
        id: 'rec_continue',
        type: 'module',
        title: 'Continue Learning Momentum',
        description: 'Keep up the great work! Your next recommended module is ready.',
        confidence: 0.88,
        reasoning: 'Consistent learning improves retention',
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
        description: 'Your progress suggests you might be ready for more challenging content.',
        confidence: 0.75,
        reasoning: 'Strong performance on beginner modules',
        actionUrl: '/assessment'
      });
    }

    return recommendations;
  }

  // Semantic Search
  async semanticSearch(query: string, context: any): Promise<SearchResult[]> {
    // Mock semantic search - in production, use vector embeddings
    const mockResults: SearchResult[] = [
      {
        id: 'search_1',
        title: 'JavaScript Fundamentals',
        content: 'Learn the basics of JavaScript programming including variables, functions, and control structures.',
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
        content: 'Understanding React components, props, and state management for building dynamic user interfaces.',
        type: 'module',
        relevanceScore: 0.87,
        metadata: {
          track: 'fullstack',
          difficulty: 'intermediate',
          estimatedTime: 180
        }
      }
    ];

    // Simple keyword matching for demo
    const queryLower = query.toLowerCase();
    return mockResults.filter(result => 
      result.title.toLowerCase().includes(queryLower) ||
      result.content.toLowerCase().includes(queryLower)
    ).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // Automated Insights
  async generateInsights(user: User, activityData: any): Promise<UserInsight[]> {
    const insights: UserInsight[] = [];
    
    // Use local storage for faster data access
    const storedUser = localStorageService.getUserById(user.id);
    if (!storedUser) return insights;

    // Progress insights
    const completionRate = user.currentPath ? 
      (user.completedModules.length / user.currentPath.modules.length) * 100 : 0;

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

    // Performance insights
    if (user.completedModules.length >= 3) {
      insights.push({
        id: 'insight_performance',
        type: 'performance',
        title: 'Learning Velocity',
        description: 'Your learning pace is consistent and effective',
        value: 'Good',
        trend: 'up',
        actionable: false,
        priority: 'low'
      });
    }

    // Recommendation insights
    if (user.skillLevel === 'beginner' && user.completedModules.length >= 5) {
      insights.push({
        id: 'insight_recommendation',
        type: 'recommendation',
        title: 'Skill Level Assessment',
        description: 'Consider retaking the assessment to unlock intermediate content',
        value: 'Action Required',
        actionable: true,
        priority: 'high'
      });
    }

    return insights;
  }

  // Document Intelligence
  async analyzeDocument(file: File): Promise<DocumentAnalysis> {
    // Mock document analysis - in production, use OCR and NLP services
    return {
      id: `doc_${Date.now()}`,
      fileName: file.name,
      type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'text',
      extractedText: 'This is mock extracted text from the document...',
      summary: 'This document appears to contain learning materials related to web development.',
      tags: ['web-development', 'javascript', 'tutorial'],
      entities: [
        { type: 'technology', value: 'JavaScript', confidence: 0.95 },
        { type: 'concept', value: 'Functions', confidence: 0.88 }
      ],
      insights: [
        'Document contains beginner-level content',
        'Suitable for fullstack development track',
        'Estimated reading time: 15 minutes'
      ]
    };
  }

  // Content Generation
  async generateContent(type: ContentGeneration['type'], prompt: string, parameters: ContentGeneration['parameters']): Promise<ContentGeneration> {
    // Mock content generation - in production, use GPT or similar
    const mockContent = {
      report: `# Learning Progress Report\n\nBased on your recent activity, you've made excellent progress in your ${prompt} track. Here are the key highlights:\n\n## Achievements\n- Completed 5 modules\n- Maintained consistent learning pace\n- Demonstrated strong understanding of core concepts\n\n## Recommendations\n- Continue with intermediate modules\n- Consider peer collaboration\n- Practice with real-world projects`,
      summary: `## Summary\n\nThis ${prompt} covers essential concepts and practical applications. Key takeaways include fundamental principles, best practices, and hands-on examples that will help you build a strong foundation.`,
      post: `🎉 Just completed another milestone in my ${prompt} learning journey! The concepts are really clicking and I'm excited to apply what I've learned. #3MTTNigeria #TechEducation #LearningJourney`,
      plan: `# Learning Plan: ${prompt}\n\n## Week 1-2: Foundations\n- Complete basic modules\n- Practice exercises\n- Review concepts\n\n## Week 3-4: Application\n- Work on projects\n- Apply learned concepts\n- Seek feedback\n\n## Week 5-6: Mastery\n- Advanced topics\n- Portfolio development\n- Prepare for next level`
    };

    return {
      type,
      prompt,
      parameters,
      result: mockContent[type] || 'Generated content would appear here.',
      metadata: {
        wordCount: mockContent[type]?.split(' ').length || 0,
        generatedAt: new Date().toISOString(),
        model: 'gpt-3.5-turbo'
      }
    };
  }

  // Predictive Analytics
  async generatePredictions(user: User, historicalData: any): Promise<PredictiveAnalytics> {
    // Fast local analytics - optimized for performance
    const currentProgress = user.currentPath ? 
      (user.completedModules.length / user.currentPath.modules.length) : 0;

    const remainingModules = user.currentPath ? 
      user.currentPath.modules.length - user.completedModules.length : 0;

    // Estimate completion date based on current pace
    const estimatedDaysToComplete = remainingModules * 3; // 3 days per module average
    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + estimatedDaysToComplete);

    return {
      userId: user.id,
      predictions: {
        completionDate: completionDate.toISOString(),
        successProbability: Math.min(0.95, 0.6 + (currentProgress * 0.3)),
        recommendedPace: currentProgress > 0.7 ? 'normal' : currentProgress > 0.3 ? 'normal' : 'slow',
        riskFactors: currentProgress < 0.2 ? ['Low engagement', 'Slow progress'] : [],
        opportunities: ['Peer collaboration', 'Advanced modules', 'Certification preparation']
      },
      trends: {
        learningVelocity: [0.2, 0.4, 0.6, 0.8, 1.0, 0.9, 1.1],
        engagementScore: [0.7, 0.8, 0.75, 0.9, 0.85, 0.95, 0.9],
        difficultyProgression: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]
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