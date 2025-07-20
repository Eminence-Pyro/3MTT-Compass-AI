import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, ExternalLink, BookOpen, Target, HelpCircle, Loader2 } from 'lucide-react';
import { SearchResult } from '../../types/ai';
import { aiService } from '../../services/aiService';

interface SemanticSearchProps {
  onResultClick?: (result: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

const SemanticSearch: React.FC<SemanticSearchProps> = ({ 
  onResultClick, 
  placeholder = "Search for modules, tracks, or ask questions...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setShowResults(true);

    try {
      const context = {
        userTrack: 'fullstack', // Could be passed as prop
        skillLevel: 'beginner'
      };

      const searchResults = await aiService.semanticSearch(searchQuery, context);
      setResults(searchResults);

      // Save to recent searches
      const updatedRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updatedRecent);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'module': return <BookOpen className="h-4 w-4 text-green-600" />;
      case 'track': return <Target className="h-4 w-4 text-blue-600" />;
      case 'resource': return <ExternalLink className="h-4 w-4 text-orange-600" />;
      case 'faq': return <HelpCircle className="h-4 w-4 text-purple-600" />;
      default: return <Search className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-700';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <>
        {parts.map((part, index) => 
          new RegExp(`^${escapedQuery}$`, 'i').test(part) ? (
            <mark key={index} className="bg-yellow-200 px-1 rounded">
              {part}
            </mark>
          ) : part
        )}
      </>
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="pl-10 pr-12"
        />
        <Button
          onClick={() => handleSearch()}
          disabled={!query.trim() || isLoading}
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Search className="h-3 w-3" />
          )}
        </Button>
      </div>

      {showResults && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-hidden shadow-lg">
          <CardContent className="p-0">
            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div className="p-3 border-b">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h4>
                <div className="flex flex-wrap gap-1">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                      }}
                      className="text-xs h-6"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {isLoading && (
              <div className="p-4 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Searching...</p>
              </div>
            )}

            {!isLoading && results.length === 0 && query && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-600">No results found for "{query}"</p>
                <p className="text-xs text-gray-500 mt-1">Try different keywords or ask a question</p>
              </div>
            )}

            {!isLoading && results.length > 0 && (
              <div className="max-h-80 overflow-y-auto">
                {results.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => {
                      onResultClick?.(result);
                      setShowResults(false);
                    }}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm truncate">
                            {highlightText(result.title, query)}
                          </h4>
                          <Badge className={`text-xs ${getRelevanceColor(result.relevanceScore)}`}>
                            {(result.relevanceScore * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {highlightText(result.content, query)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                          {result.metadata?.estimatedTime && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {result.metadata.estimatedTime} min
                            </div>
                          )}
                          {result.metadata?.difficulty && (
                            <Badge variant="outline" className="text-xs">
                              {result.metadata.difficulty}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SemanticSearch;