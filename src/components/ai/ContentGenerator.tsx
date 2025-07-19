import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PenTool, Copy, Download, RefreshCw, Sparkles, FileText, MessageSquare, BarChart3, Calendar } from 'lucide-react';
import { ContentGeneration } from '../../types/ai';
import { aiService } from '../../services/aiService';
import { toast } from 'sonner';

interface ContentGeneratorProps {
  userContext?: {
    track: string;
    skillLevel: string;
    completedModules: number;
  };
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({ userContext }) => {
  const [contentType, setContentType] = useState<ContentGeneration['type']>('summary');
  const [prompt, setPrompt] = useState('');
  const [parameters, setParameters] = useState<ContentGeneration['parameters']>({
    tone: 'professional',
    length: 'medium',
    format: 'markdown',
    includeData: false
  });
  const [generatedContent, setGeneratedContent] = useState<ContentGeneration | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [templates, setTemplates] = useState<{ [key: string]: string }>({
    report: `Generate a comprehensive learning progress report for my ${userContext?.track || 'software development'} track. Include achievements, areas for improvement, and next steps.`,
    summary: `Create a summary of key concepts in ${userContext?.track || 'web development'} that I should focus on at the ${userContext?.skillLevel || 'beginner'} level.`,
    post: `Write a social media post about my learning journey in the 3MTT program, highlighting recent achievements and encouraging others to join.`,
    plan: `Create a detailed learning plan for the next month to help me progress from ${userContext?.skillLevel || 'beginner'} to the next level in ${userContext?.track || 'software development'}.`
  });

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for content generation');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await aiService.generateContent(contentType, prompt, parameters);
      setGeneratedContent(result);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.result);
      toast.success('Content copied to clipboard!');
    }
  };

  const handleDownload = () => {
    if (generatedContent) {
      const blob = new Blob([generatedContent.result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `generated-${contentType}-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Content downloaded!');
    }
  };

  const useTemplate = (type: ContentGeneration['type']) => {
    setPrompt(templates[type] || '');
    setContentType(type);
  };

  const getContentTypeIcon = (type: ContentGeneration['type']) => {
    switch (type) {
      case 'report': return <BarChart3 className="h-4 w-4" />;
      case 'summary': return <FileText className="h-4 w-4" />;
      case 'post': return <MessageSquare className="h-4 w-4" />;
      case 'plan': return <Calendar className="h-4 w-4" />;
      default: return <PenTool className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Content Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate Content</TabsTrigger>
              <TabsTrigger value="templates">Quick Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              {/* Content Type Selection */}
              <div className="space-y-2">
                <Label>Content Type</Label>
                <Select value={contentType} onValueChange={(value) => setContentType(value as ContentGeneration['type'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="report">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Progress Report
                      </div>
                    </SelectItem>
                    <SelectItem value="summary">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Learning Summary
                      </div>
                    </SelectItem>
                    <SelectItem value="post">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Social Media Post
                      </div>
                    </SelectItem>
                    <SelectItem value="plan">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Learning Plan
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <Label>Content Prompt</Label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to generate..."
                  rows={4}
                />
              </div>

              {/* Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={parameters.tone} onValueChange={(value) => setParameters(prev => ({ ...prev, tone: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Length</Label>
                  <Select value={parameters.length} onValueChange={(value) => setParameters(prev => ({ ...prev, length: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (100-200 words)</SelectItem>
                      <SelectItem value="medium">Medium (300-500 words)</SelectItem>
                      <SelectItem value="long">Long (600+ words)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select value={parameters.format} onValueChange={(value) => setParameters(prev => ({ ...prev, format: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="markdown">Markdown</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="plain">Plain Text</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={parameters.includeData}
                      onChange={(e) => setParameters(prev => ({ ...prev, includeData: e.target.checked }))}
                    />
                    Include Personal Data
                  </Label>
                  <p className="text-xs text-gray-600">Include your learning progress and achievements</p>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(templates).map(([type, template]) => (
                  <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => useTemplate(type as ContentGeneration['type'])}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {getContentTypeIcon(type as ContentGeneration['type'])}
                        <h4 className="font-medium capitalize">{type}</h4>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">{template}</p>
                      <Button size="sm" className="mt-3 w-full" variant="outline">
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getContentTypeIcon(generatedContent.type)}
                Generated {generatedContent.type.charAt(0).toUpperCase() + generatedContent.type.slice(1)}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Metadata */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {generatedContent.metadata.wordCount} words
                </Badge>
                <Badge variant="outline">
                  {generatedContent.parameters.tone} tone
                </Badge>
                <Badge variant="outline">
                  {generatedContent.parameters.length} length
                </Badge>
                <Badge variant="outline">
                  {generatedContent.parameters.format} format
                </Badge>
              </div>

              {/* Content */}
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                  {generatedContent.result}
                </pre>
              </div>

              {/* Generation Info */}
              <div className="text-xs text-gray-500 flex justify-between">
                <span>Generated with {generatedContent.metadata.model}</span>
                <span>{new Date(generatedContent.metadata.generatedAt).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContentGenerator;