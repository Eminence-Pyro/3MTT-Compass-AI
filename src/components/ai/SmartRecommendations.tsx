import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, Clock, Target, BookOpen, TrendingUp, X } from 'lucide-react';
import { SmartRecommendation } from '../../types/ai';
import { aiService } from '../../services/aiService';
import { User } from '../../types';

interface SmartRecommendationsProps {
  user: User;
  onRecommendationClick?: (recommendation: SmartRecommendation) => void;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ user, onRecommendationClick }) => {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, [user.completedModules.length, user.skillLevel]);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const behaviorData = {
        recentActivity: user.completedModules.slice(-5),
        learningPace: 'normal', // Could be calculated from actual data
        preferredTime: 'evening',
        strugglingAreas: []
      };

      const recs = await aiService.generateRecommendations(user, behaviorData);
      setRecommendations(recs.filter(rec => !dismissedIds.includes(rec.id)));
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  const getRecommendationIcon = (type: SmartRecommendation['type']) => {
    switch (type) {
      case 'module': return <BookOpen className="h-5 w-5" />;
      case 'track': return <Target className="h-5 w-5" />;
      case 'action': return <TrendingUp className="h-5 w-5" />;
      case 'resource': return <Lightbulb className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-700';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-orange-500" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-orange-500" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-4">
            No new recommendations at the moment. Keep learning to unlock personalized suggestions!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-orange-500" />
          Smart Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="text-orange-500">
                    {getRecommendationIcon(recommendation.type)}
                  </div>
                  <h4 className="font-medium">{recommendation.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getConfidenceColor(recommendation.confidence)}`}>
                    {(recommendation.confidence * 100).toFixed(0)}% match
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(recommendation.id)}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3">{recommendation.description}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {recommendation.metadata?.estimatedTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recommendation.metadata.estimatedTime} min
                    </div>
                  )}
                  {recommendation.metadata?.difficulty && (
                    <Badge variant="outline" className="text-xs">
                      {recommendation.metadata.difficulty}
                    </Badge>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={() => onRecommendationClick?.(recommendation)}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Take Action
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>

              <div className="mt-2 text-xs text-gray-500 italic">
                💡 {recommendation.reasoning}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;