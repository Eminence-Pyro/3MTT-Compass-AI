import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ArrowRight, Clock, RefreshCw, X, Loader2, AlertCircle } from 'lucide-react';
import { User } from '../../types/index';
import { apiService } from '../../services/apiService';

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  reason: string;
  estimatedTime: string;
  priority: 'high' | 'medium' | 'low';
  actionLabel: string;
}

interface SmartRecommendationsProps {
  user: User;
  onRecommendationClick?: (rec: Recommendation) => void;
}

const PRIORITY_COLORS = {
  high:   'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low:    'bg-blue-100 text-blue-700 border-blue-200',
};

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ user, onRecommendationClick }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState('');
  const [dismissed, setDismissed]             = useState<string[]>([]);

  useEffect(() => { loadRecommendations(); }, [user.completedModules?.length]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.aiRecommend();
      setRecommendations((data.recommendations || []).filter((r: Recommendation) => !dismissed.includes(r.id)));
    } catch (err) {
      setError('Could not load recommendations. Check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const dismiss = (id: string) => {
    setDismissed(prev => [...prev, id]);
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Recommendations
            <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50 ml-1">
              Groq AI
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={loadRecommendations} disabled={loading} className="h-8 w-8">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin text-green-600" />
            <span className="text-sm">Generating personalized recommendations…</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
            <Button variant="ghost" size="sm" onClick={loadRecommendations} className="ml-auto text-red-600 h-7">
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && recommendations.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-6">
            All recommendations dismissed. <button onClick={loadRecommendations} className="text-green-600 hover:underline">Refresh</button>
          </p>
        )}

        <div className="space-y-3">
          {recommendations.map(rec => (
            <div key={rec.id}
              className="relative p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-green-200 hover:bg-green-50/30 transition-all group">
              {/* Dismiss */}
              <button onClick={() => dismiss(rec.id)}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600">
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-start gap-3 pr-6">
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-semibold text-sm text-gray-900">{rec.title}</h4>
                    <Badge className={`text-[10px] px-1.5 py-0 border ${PRIORITY_COLORS[rec.priority] || PRIORITY_COLORS.medium}`}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-xs mb-1.5 leading-relaxed">{rec.description}</p>
                  <p className="text-green-700 text-xs italic mb-3">💡 {rec.reason}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="h-3 w-3" />
                      {rec.estimatedTime}
                    </div>
                    <Button size="sm"
                      onClick={() => onRecommendationClick?.(rec)}
                      className="h-7 text-xs bg-green-600 hover:bg-green-700 gap-1">
                      {rec.actionLabel || 'Start'} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartRecommendations;
