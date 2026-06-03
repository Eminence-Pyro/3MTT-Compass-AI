import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { User } from '../../types/index';
import { apiService } from '../../services/apiService';

interface SearchResult {
  title: string;
  description: string;
  relevance: number;
  type: string;
  tags: string[];
}

interface SemanticSearchProps {
  user: User;
}

const SemanticSearch: React.FC<SemanticSearchProps> = ({ user }) => {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<SearchResult[]>([]);
  const [suggested, setSuggested] = useState<string[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const data = await apiService.aiSearch(q);
      setResults(data.results || []);
      setSuggested(data.suggestedTopics || []);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const RELEVANCE_COLOR = (r: number) =>
    r >= 0.8 ? 'bg-green-100 text-green-700' : r >= 0.5 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600';

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Search className="h-5 w-5 text-blue-500" />
          Semantic Search
          <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Search input */}
        <div className="flex gap-2 mb-4">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder={`Search your ${user.track || 'track'} content…`}
            className="flex-1 rounded-xl"
          />
          <Button onClick={handleSearch} disabled={!query.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm mb-3">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* Results */}
        {!loading && searched && results.length === 0 && !error && (
          <p className="text-center text-gray-500 text-sm py-4">No results found. Try a different search.</p>
        )}

        <div className="space-y-3">
          {results.map((r, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50 hover:border-blue-200 hover:bg-blue-50/30 transition-all">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-blue-500 flex-shrink-0" />
                  <h4 className="font-semibold text-sm text-gray-900">{r.title}</h4>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${RELEVANCE_COLOR(r.relevance)}`}>
                  {Math.round(r.relevance * 100)}% match
                </span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-2 ml-6">{r.description}</p>
              <div className="flex flex-wrap gap-1.5 ml-6">
                {r.tags.map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested topics */}
        {suggested.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Related topics
            </p>
            <div className="flex flex-wrap gap-2">
              {suggested.map(s => (
                <button key={s} onClick={() => { setQuery(s); }}
                  className="text-xs px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-full hover:bg-blue-100 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SemanticSearch;
