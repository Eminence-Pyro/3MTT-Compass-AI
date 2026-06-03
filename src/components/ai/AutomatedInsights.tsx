import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, RefreshCw, Loader2, AlertCircle, TrendingUp, Star, Target, Zap } from 'lucide-react';
import { User } from '../../types/index';
import { apiService } from '../../services/apiService';

interface Insights {
  summary: string;
  strengths: string[];
  improvements: string[];
  nextMilestone: string;
  motivationalMessage: string;
  progressScore: number;
}

interface AutomatedInsightsProps {
  user: User;
  refreshKey?: number;
}

const AutomatedInsights: React.FC<AutomatedInsightsProps> = ({ user, refreshKey }) => {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => { loadInsights(); }, [user.completedModules?.length, refreshKey]);

  const loadInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.aiInsights();
      setInsights(data);
    } catch (err) {
      setError('Could not generate insights. Try refreshing.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (s: number) =>
    s >= 70 ? 'text-green-600' : s >= 40 ? 'text-yellow-600' : 'text-red-500';

  const scoreBg = (s: number) =>
    s >= 70 ? 'bg-green-100' : s >= 40 ? 'bg-yellow-100' : 'bg-red-100';

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Learning Insights
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={loadInsights} disabled={loading} className="h-8 w-8">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
            <span className="text-sm">Analysing your learning journey…</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            <Button variant="ghost" size="sm" onClick={loadInsights} className="ml-auto text-red-600 h-7">Retry</Button>
          </div>
        )}

        {insights && !loading && (
          <div className="space-y-4">
            {/* Progress score */}
            <div className={`flex items-center gap-3 p-4 rounded-xl ${scoreBg(insights.progressScore)}`}>
              <div className={`text-3xl font-black ${scoreColor(insights.progressScore)}`}>
                {insights.progressScore}
              </div>
              <div>
                <p className={`font-semibold text-sm ${scoreColor(insights.progressScore)}`}>Progress Score</p>
                <p className="text-gray-600 text-xs">out of 100</p>
              </div>
              <TrendingUp className={`h-6 w-6 ml-auto ${scoreColor(insights.progressScore)}`} />
            </div>

            {/* Summary */}
            <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-gray-700 text-sm leading-relaxed">{insights.summary}</p>
            </div>

            {/* Strengths */}
            {insights.strengths?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-yellow-500" /> Strengths
                </p>
                <ul className="space-y-1.5">
                  {insights.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-500 font-bold mt-0.5">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Improvements */}
            {insights.improvements?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Target className="h-3.5 w-3.5 text-blue-500" /> Areas to Improve
                </p>
                <ul className="space-y-1.5">
                  {insights.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-blue-500 font-bold mt-0.5">→</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next milestone */}
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-100 flex items-start gap-2">
              <Zap className="h-4 w-4 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-purple-700 mb-0.5">Next Milestone</p>
                <p className="text-purple-700 text-sm">{insights.nextMilestone}</p>
              </div>
            </div>

            {/* Motivational message */}
            <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-center">
              <p className="text-green-700 text-sm font-medium italic">"{insights.motivationalMessage}"</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedInsights;
