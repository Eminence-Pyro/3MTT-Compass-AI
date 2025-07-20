import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Brain, AlertTriangle, CheckCircle, Target, Lightbulb } from 'lucide-react';
import { UserInsight } from '../../types/ai';
import { aiService } from '../../services/aiService';
import { User } from '../../types/index';

interface AutomatedInsightsProps {
  user: User;
  refreshTrigger?: number;
}

const AutomatedInsights: React.FC<AutomatedInsightsProps> = ({ user, refreshTrigger = 0 }) => {
  const [insights, setInsights] = useState<UserInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedInsights, setExpandedInsights] = useState<string[]>([]);

  useEffect(() => {
    loadInsights();
  }, [user.completedModules.length, user.skillLevel, refreshTrigger, loadInsights]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const activityData = {
        sessionCount: 15,
        averageSessionTime: 45,
        lastActiveDate: new Date().toISOString(),
        strugglingTopics: [],
        strongTopics: user.completedModules.slice(0, 3)
      };

      const generatedInsights = await aiService.generateInsights(user, activityData);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <Minus className="h-4 w-4 text-gray-600" />;
      default: return null;
    }
  };

  const getPriorityColor = (priority: UserInsight['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getInsightIcon = (type: UserInsight['type']) => {
    switch (type) {
      case 'progress': return <Target className="h-5 w-5 text-blue-600" />;
      case 'performance': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'recommendation': return <Lightbulb className="h-5 w-5 text-orange-600" />;
      case 'prediction': return <Brain className="h-5 w-5 text-purple-600" />;
      default: return <CheckCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const toggleExpanded = (insightId: string) => {
    setExpandedInsights(prev => 
      prev.includes(insightId) 
        ? prev.filter(id => id !== insightId)
        : [...prev, insightId]
    );
  };

  const getActionableInsights = () => insights.filter(insight => insight.actionable);
  const getHighPriorityInsights = () => insights.filter(insight => insight.priority === 'high');

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Insights
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Insights</p>
                <p className="text-2xl font-bold text-blue-700">{insights.length}</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Action Required</p>
                <p className="text-2xl font-bold text-orange-700">{getActionableInsights().length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">High Priority</p>
                <p className="text-2xl font-bold text-red-700">{getHighPriorityInsights().length}</p>
              </div>
              <Target className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Personalized Insights
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadInsights}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {insights.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No insights available yet.</p>
              <p className="text-sm text-gray-500">Complete more modules to unlock AI insights!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className={`border rounded-lg p-4 ${getPriorityColor(insight.priority)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getInsightIcon(insight.type)}
                      <div>
                        <h4 className="font-medium">{insight.title}</h4>
                        <p className="text-sm opacity-80">{insight.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTrendIcon(insight.trend)}
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-semibold">
                        {insight.value}
                      </div>
                      <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                        {insight.priority} priority
                      </Badge>
                      {insight.actionable && (
                        <Badge className="text-xs bg-blue-100 text-blue-700">
                          Action Required
                        </Badge>
                      )}
                    </div>

                    {insight.actionable && (
                      <Button
                        size="sm"
                        onClick={() => toggleExpanded(insight.id)}
                        variant="outline"
                      >
                        {expandedInsights.includes(insight.id) ? 'Hide' : 'View'} Actions
                      </Button>
                    )}
                  </div>

                  {/* Expanded Actions */}
                  {expandedInsights.includes(insight.id) && insight.actionable && (
                    <div className="mt-4 p-3 bg-white/50 rounded border">
                      <h5 className="font-medium mb-2">Recommended Actions:</h5>
                      <ul className="text-sm space-y-1">
                        {insight.type === 'recommendation' && (
                          <>
                            <li>• Retake the skill assessment to unlock new content</li>
                            <li>• Review completed modules for better understanding</li>
                            <li>• Consider switching to intermediate difficulty</li>
                          </>
                        )}
                        {insight.type === 'progress' && insight.priority === 'high' && (
                          <>
                            <li>• Set daily learning goals to improve consistency</li>
                            <li>• Join study groups or find a learning partner</li>
                            <li>• Break down complex modules into smaller sessions</li>
                          </>
                        )}
                        {insight.type === 'performance' && (
                          <>
                            <li>• Continue with your current learning pace</li>
                            <li>• Consider taking on more challenging projects</li>
                            <li>• Share your progress with the community</li>
                          </>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AutomatedInsights;