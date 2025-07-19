import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, Image, Eye, Download, Tag, Brain, Clock, CheckCircle } from 'lucide-react';
import { DocumentAnalysis } from '../../types/ai';
import { aiService } from '../../services/aiService';

interface DocumentIntelligenceProps {
  onAnalysisComplete?: (analysis: DocumentAnalysis) => void;
}

const DocumentIntelligence: React.FC<DocumentIntelligenceProps> = ({ onAnalysisComplete }) => {
  const [analyses, setAnalyses] = useState<DocumentAnalysis[]>([]);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      setAnalyzing(true);
      setUploadProgress(100);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const analysis = await aiService.analyzeDocument(file);
      setAnalyses(prev => [analysis, ...prev]);
      onAnalysisComplete?.(analysis);
      
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setUploading(false);
      setAnalyzing(false);
      setUploadProgress(0);
      clearInterval(progressInterval);
    }
  };

  const getFileTypeIcon = (type: DocumentAnalysis['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-600" />;
      case 'image': return <Image className="h-5 w-5 text-blue-600" />;
      case 'text': return <FileText className="h-5 w-5 text-green-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEntityColor = (type: string) => {
    const colors = {
      technology: 'bg-blue-100 text-blue-700',
      concept: 'bg-green-100 text-green-700',
      person: 'bg-purple-100 text-purple-700',
      organization: 'bg-orange-100 text-orange-700',
      location: 'bg-pink-100 text-pink-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Document Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Documents for AI Analysis</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to browse. Supports PDF, images, and text files.
            </p>
            
            <input
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button className="cursor-pointer">
                Choose Files
              </Button>
            </label>

            {(uploading || analyzing) && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-gray-600">
                  {analyzing ? 'Analyzing document with AI...' : 'Uploading...'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analyses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-green-600" />
              Analysis Results ({analyses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {analyses.map((analysis) => (
                <div key={analysis.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getFileTypeIcon(analysis.type)}
                      <div>
                        <h4 className="font-medium">{analysis.fileName}</h4>
                        <p className="text-sm text-gray-600 capitalize">{analysis.type} document</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Analyzed
                    </Badge>
                  </div>

                  <Tabs defaultValue="summary" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="summary">Summary</TabsTrigger>
                      <TabsTrigger value="entities">Entities</TabsTrigger>
                      <TabsTrigger value="insights">Insights</TabsTrigger>
                      <TabsTrigger value="text">Full Text</TabsTrigger>
                    </TabsList>

                    <TabsContent value="summary" className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">AI Summary</h5>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">{analysis.summary}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2">Tags</h5>
                        <div className="flex flex-wrap gap-2">
                          {analysis.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="entities" className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-3">Extracted Entities</h5>
                        <div className="space-y-2">
                          {analysis.entities.map((entity, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                <Badge className={`text-xs ${getEntityColor(entity.type)}`}>
                                  {entity.type}
                                </Badge>
                                <span className="font-medium">{entity.value}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {(entity.confidence * 100).toFixed(0)}% confidence
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="insights" className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-3">AI Insights</h5>
                        <div className="space-y-2">
                          {analysis.insights.map((insight, index) => (
                            <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded">
                              <Brain className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-blue-800">{insight}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="text" className="space-y-4">
                      <div>
                        <h5 className="font-medium mb-2">Extracted Text</h5>
                        <div className="bg-gray-50 p-4 rounded max-h-64 overflow-y-auto">
                          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {analysis.extractedText}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end mt-4">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Analysis
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analyses.length === 0 && !uploading && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No documents analyzed yet.</p>
            <p className="text-sm text-gray-500">Upload a document to see AI-powered analysis!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DocumentIntelligence;