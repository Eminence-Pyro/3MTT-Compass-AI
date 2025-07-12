import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { assessments } from '../data/assessments';
import { analyzeAssessment, generatePersonalizedPath, adaptLearningPath } from '../utils/aiRecommendations';
import { tracks } from '../data/tracks';
import { LearningPath } from '../types';
import { toast } from 'sonner';
import { checkForNewAchievements, Achievement } from '../utils/achievementEngine';

import AuthForm from '../components/AuthForm';
import TrackSelection from '../components/TrackSelection';
import Assessment from '../components/Assessment';
import LearningDashboard from '../components/LearningDashboard';
import AchievementNotification from '../components/AchievementNotification';

type AppState = 'auth' | 'track-selection' | 'assessment' | 'dashboard';

const Index = () => {
  const { user, loading, login, logout, updateUser } = useAuth();
  const [appState, setAppState] = useState<AppState>('auth');
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  React.useEffect(() => {
    if (!loading && user) {
      if (!user.track) {
        setAppState('track-selection');
      } else if (!user.assessmentCompleted) {
        setAppState('assessment');
      } else {
        setAppState('dashboard');
      }
    } else if (!loading && !user) {
      setAppState('auth');
    }
  }, [user, loading]);

  const handleLogin = async (email: string, password: string, name: string) => {
    await login(email, password, name);
    toast.success('Welcome to 3MTT Compass AI!');
  };

  const handleTrackSelection = (trackId: string) => {
    console.log('Track selected:', trackId);
    const selectedTrack = tracks.find(t => t.id === trackId);
    updateUser({ 
      track: trackId,
    });
    toast.success(`${selectedTrack?.name} track selected!`);
    setAppState('assessment');
  };

  const handleAssessmentComplete = (answers: number[]) => {
    console.log('Assessment completed with answers:', answers);
    
    const assessment = assessments.find(a => a.track === user?.track);
    if (!assessment || !user) return;

    // Analyze assessment results
    const result = analyzeAssessment(answers, assessment.questions);
    console.log('Assessment analysis:', result);

    // Generate personalized learning path
    const pathModules = generatePersonalizedPath(user, result, user.track);
    console.log('Generated path modules:', pathModules);

    const learningPath: LearningPath = {
      id: `path_${Date.now()}`,
      userId: user.id,
      track: user.track,
      modules: pathModules,
      progress: 0,
      adaptationHistory: [`Initial path generated based on ${result.skillLevel} level assessment`],
      createdAt: new Date().toISOString()
    };

    // Update user with assessment results and learning path
    const updatedUser = {
      assessmentCompleted: true,
      skillLevel: result.skillLevel,
      currentPath: learningPath,
      achievements: user.achievements || [],
      totalPoints: user.totalPoints || 0
    };

    updateUser(updatedUser);

    // Check for achievements
    const achievements = checkForNewAchievements({ ...user, ...updatedUser }, user.completedModules);
    if (achievements.length > 0) {
      const userAchievements = [...(user.achievements || []), ...achievements];
      updateUser({ 
        achievements: userAchievements,
        totalPoints: userAchievements.reduce((total, a) => total + a.points, 0)
      });
      setNewAchievements(achievements);
    }

    toast.success(`Personalized learning path generated! You're at ${result.skillLevel} level.`);
    setAppState('dashboard');
  };

  const handleModuleComplete = (moduleId: string) => {
    if (!user) return;
    
    const previousCompletedModules = [...user.completedModules];
    const updatedCompletedModules = [...user.completedModules, moduleId];
    
    // Check for new achievements
    const tempUser = { ...user, completedModules: updatedCompletedModules };
    const achievements = checkForNewAchievements(tempUser, previousCompletedModules);
    
    const updatedUser: any = { completedModules: updatedCompletedModules };
    
    if (achievements.length > 0) {
      const userAchievements = [...(user.achievements || []), ...achievements];
      updatedUser.achievements = userAchievements;
      updatedUser.totalPoints = userAchievements.reduce((total, a) => total + a.points, 0);
      setNewAchievements(achievements);
    }
    
    updateUser(updatedUser);
    
    const module = user.currentPath?.modules.find(m => m.id === moduleId);
    toast.success(`Module "${module?.title}" completed! 🎉`);
    
    console.log('Module completed:', moduleId);
  };

  const handleAdaptPath = () => {
    if (!user || !user.currentPath) return;

    console.log('Adapting learning path...');
    const adaptedModules = adaptLearningPath(
      user.currentPath.modules,
      user.completedModules,
      user
    );

    const updatedPath: LearningPath = {
      ...user.currentPath,
      modules: adaptedModules,
      adaptationHistory: [
        ...user.currentPath.adaptationHistory,
        `Path adapted based on ${user.completedModules.length} completed modules`
      ]
    };

    updateUser({ currentPath: updatedPath });
    toast.success('Learning path adapted based on your progress!');
  };

  const handleLogout = () => {
    logout();
    setAppState('auth');
    toast.success('Logged out successfully');
  };

  const closeAchievementNotification = () => {
    setNewAchievements([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3MTT Compass AI...</p>
        </div>
      </div>
    );
  }

  switch (appState) {
    case 'auth':
      return <AuthForm onLogin={handleLogin} />;
    
    case 'track-selection':
      return <TrackSelection onSelectTrack={handleTrackSelection} />;
    
    case 'assessment':
      const assessment = assessments.find(a => a.track === user?.track);
      if (!assessment) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Assessment Not Found</h2>
              <p className="text-gray-600">No assessment available for the selected track.</p>
            </div>
          </div>
        );
      }
      return <Assessment assessment={assessment} onComplete={handleAssessmentComplete} />;
    
    case 'dashboard':
      if (!user) return null;
      return (
        <LearningDashboard 
          user={user}
          onModuleComplete={handleModuleComplete}
          onLogout={handleLogout}
          onAdaptPath={handleAdaptPath}
        />
      );
    
    default:
      return null;
  }

  return (
    <>
      {/* Main App Content */}
      {(() => {
        switch (appState) {
          case 'auth':
            return <AuthForm onLogin={handleLogin} />;
          case 'track-selection':
            return <TrackSelection onSelectTrack={handleTrackSelection} />;
          case 'assessment':
            const assessment = assessments.find(a => a.track === user?.track);
            if (!assessment) {
              return (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Assessment Not Found</h2>
                    <p className="text-gray-600">No assessment available for the selected track.</p>
                  </div>
                </div>
              );
            }
            return <Assessment assessment={assessment} onComplete={handleAssessmentComplete} />;
          case 'dashboard':
            if (!user) return null;
            return (
              <LearningDashboard
                user={user}
                onModuleComplete={handleModuleComplete}
                onLogout={handleLogout}
                onAdaptPath={handleAdaptPath}
              />
            );
          default:
            return null;
        }
      })()}
      
      {/* Achievement Notifications */}
      {newAchievements.length > 0 && user && (
        <AchievementNotification
          achievements={newAchievements}
          user={user}
          onClose={closeAchievementNotification}
        />
      )}
    </>
  );
};

export default Index;
