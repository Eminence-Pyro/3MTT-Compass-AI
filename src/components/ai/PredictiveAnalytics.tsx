import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar, AlertTriangle, Target, Brain, Zap, Clock, Trophy } from 'lucide-react';
import { PredictiveAnalytics as PredictiveAnalyticsType } from '../../types/ai';
import { aiService } from '../../services/aiService';
import { User } from '../../types/index';

interface PredictiveAnalyticsProps {
  user: User;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ user }) => {
  const [analytics, setAnalytics] = useState<PredictiveAnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPredictions();
  }, [user.completedModules.length]);

  const loadPredictions = async () => {
    setLoading(true);
    try {
      const historicalData = {
        weeklyActivity: [3, 5, 4, 6, 5, 7, 4],
        completionTimes: [45, 38, 52, 41, 47],
        difficultyRatings: [3, 4, 3, 5, 4],
        engagementScores: [0.8, 0.9, 0.7, 0.85, 0.9]
      };

      const predictions = await aiService.generatePredictions(user, historicalData);
      setAnalytics(predictions);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getPaceColor = (pace: string) => {
    switch (pace) {
      case 'fast': return 'bg-green-100 text-green-700';
      case 'normal': return 'bg-blue-100 text-blue-700';
      case 'slow': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSuccessProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-green-600';
    if (probability >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Prepare chart data
  const trendData = analytics ? [
    { name: 'Week 1', velocity: analytics.trends.learningVelocity[0], engagement: analytics.trends.engagementScore[0], difficulty: analytics.trends.difficultyProgression[0] },
    { name: 'Week 2', velocity: analytics.trends.learningVelocity[1], engagement: analytics.trends.engagementScore[1], difficulty: analytics.trends.difficultyProgression[1] },
    { name: 'Week 3', velocity: analytics.trends.learningVelocity[2], engagement: analytics.trends.engagementScore[2], difficulty: analytics.trends.difficultyProgression[2] },
    { name: 'Week 4', velocity: analytics.trends.learningVelocity[3], engagement: analytics.trends.engagementScore[3], difficulty: analytics.trends.difficultyProgression[3] },
    { name: 'Week 5', velocity: analytics.trends.learningVelocity[4], engagement: analytics.trends.engagementScore[4], difficulty: analytics.trends.difficultyProgression[4] },
    { name: 'Week 6', velocity: analytics.trends.learningVelocity[5], engagement: analytics.trends.engagementScore[5], difficulty: analytics.trends.difficultyProgression[5] },
    { name: 'Week 7', velocity: analytics.trends.learningVelocity[6], engagement: analytics.trends.engagementScore[6], difficulty: analytics.trends.difficultyProgression[6] }
  ] : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Predictive Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Predictive Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 py-8">
            Unable to load predictive analytics. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Completion Date</p>
                <p className="text-lg font-bold text-blue-700">
                  {formatDate(analytics.predictions.completionDate)}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Success Rate</p>
                <p className={`text-lg font-bold ${getSuccessProbabilityColor(analytics.predictions.successProbability)}`}>
                  {(analytics.predictions.successProbability * 100).toFixed(0)}%
                </p>
              </div>
              <Trophy className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Recommended Pace</p>
                <Badge className={`${getPaceColor(analytics.predictions.recommendedPace)} font-bold`}>
                  {analytics.predictions.recommendedPace}
                </Badge>
              </div>
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Next Week Activity</p>
                <p className="text-lg font-bold text-purple-700">
                  {analytics.forecasts.nextWeekActivity} modules
                </p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Learning Trends & Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                        <p className="font-medium">{label}</p>
                        <p className="text-blue-600">Velocity: {(payload[0].value as number * 100).toFixed(0)}%</p>
                        <p className="text-green-600">Engagement: {(payload[1].value as number * 100).toFixed(0)}%</p>
                        <p className="text-purple-600">Difficulty: {(payload[2].value as number * 100).toFixed(0)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line type="monotone" dataKey="velocity" stroke="#3b82f6" strokeWidth={2} name="Learning Velocity" />
              <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={2} name="Engagement Score" />
              <Line type="monotone" dataKey="difficulty" stroke="#8b5cf6" strokeWidth={2} name="Difficulty Progression" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Forecasts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Monthly Progress Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Expected Progress</span>
                <span className="font-semibold">{analytics.forecasts.monthlyProgress.toFixed(0)}%</span>
              </div>
              <Progress value={analytics.forecasts.monthlyProgress} className="h-3" />
              <p className="text-sm text-gray-600">
                Based on your current learning velocity, you're projected to complete{' '}
                <span className="font-medium">{analytics.forecasts.monthlyProgress.toFixed(0)}%</span> of your track this month.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Skill Level Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Current Level</span>
                <Badge className="bg-blue-100 text-blue-700">{user.skillLevel}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Predicted Next Level</span>
                <Badge className="bg-green-100 text-green-700">{analytics.forecasts.skillLevelProgression}</Badge>
              </div>
              <p className="text-sm text-gray-600">
                You're on track to reach{' '}
                <span className="font-medium">{analytics.forecasts.skillLevelProgression}</span> level
                based on your learning patterns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors & Opportunities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {analytics.predictions.riskFactors.length > 0 && (
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.predictions.riskFactors.map((risk, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                    <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-800">{risk}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Target className="h-5 w-5" />
              Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.predictions.opportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                  <Target className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-800">{opportunity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;