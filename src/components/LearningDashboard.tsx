
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  Play, 
  Clock,
  Trophy,
  Target,
  TrendingUp,
  LogOut,
  Lightbulb
} from 'lucide-react';
import { User, LearningModule } from '../types';

interface LearningDashboardProps {
  user: User;
  onModuleComplete: (moduleId: string) => void;
  onLogout: () => void;
  onAdaptPath: () => void;
}

const LearningDashboard: React.FC<LearningDashboardProps> = ({ 
  user, 
  onModuleComplete, 
  onLogout,
  onAdaptPath 
}) => {
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);

  if (!user.currentPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Learning Path Found</h2>
          <p className="text-gray-600">Please complete the assessment to generate your path.</p>
        </div>
      </div>
    );
  }

  const totalModules = user.currentPath.modules.length;
  const completedCount = user.completedModules.length;
  const progressPercentage = (completedCount / totalModules) * 100;
  const currentModule = user.currentPath.modules.find(
    module => !user.completedModules.includes(module.id)
  );

  const handleModuleClick = (module: LearningModule) => {
    setSelectedModule(module);
  };

  const handleStartModule = (moduleId: string) => {
    const module = user.currentPath?.modules.find(m => m.id === moduleId);
    if (module?.type === 'external' && module.url) {
      window.open(module.url, '_blank');
    }
    // For internal modules, we'd normally navigate to the module content
    console.log('Starting module:', moduleId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-700">3MTT Compass AI</h1>
                <p className="text-sm text-gray-600">Welcome back, {user.name}!</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout} className="text-gray-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-700">Your Learning Journey</CardTitle>
                    <CardDescription>
                      {user.track.charAt(0).toUpperCase() + user.track.slice(1)} Track
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    {user.skillLevel}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress: {completedCount} of {totalModules} modules</span>
                    <span className="font-semibold">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-orange-500" />
                      {completedCount} completed
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      {user.skillLevel} level
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Module */}
            {currentModule && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-700 flex items-center gap-2">
                    <Play className="w-5 h-5" />
                    Continue Learning
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{currentModule.title}</h3>
                      <p className="text-gray-600 mt-1">{currentModule.description}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {currentModule.estimatedTime} min
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {currentModule.difficulty}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          currentModule.type === '3mtt-internal' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {currentModule.type === '3mtt-internal' ? '3MTT Module' : 'External Resource'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleStartModule(currentModule.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {currentModule.type === 'external' ? (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Resource
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Start Module
                          </>
                        )}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => onModuleComplete(currentModule.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Learning Path */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-green-700">Your Learning Path</CardTitle>
                    <CardDescription>
                      AI-curated modules tailored to your skill level
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={onAdaptPath}
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Adapt Path
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {user.currentPath.modules.map((module, index) => {
                    const isCompleted = user.completedModules.includes(module.id);
                    const isCurrent = module.id === currentModule?.id;
                    
                    return (
                      <div
                        key={module.id}
                        onClick={() => handleModuleClick(module)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                          isCompleted 
                            ? 'bg-green-50 border-green-200' 
                            : isCurrent
                            ? 'bg-orange-50 border-orange-200 ring-2 ring-orange-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isCurrent
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <span className="text-sm font-semibold">{index + 1}</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{module.title}</h4>
                              {module.type === 'external' && (
                                <ExternalLink className="w-3 h-3 text-blue-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">{module.estimatedTime} min</span>
                              <Badge variant="outline" className="text-xs">
                                {module.difficulty}
                              </Badge>
                              {module.source && (
                                <span className="text-xs text-gray-500">• {module.source}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Modules Completed</span>
                  <span className="font-semibold text-green-600">{completedCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Level</span>
                  <Badge className="bg-green-100 text-green-700">{user.skillLevel}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Track Progress</span>
                  <span className="font-semibold text-orange-600">{Math.round(progressPercentage)}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All Modules
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Target className="w-4 h-4 mr-2" />
                  Set Learning Goals
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Progress Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningDashboard;
