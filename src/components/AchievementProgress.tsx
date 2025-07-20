
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { User, Achievement } from '../types/index';
import { achievementTemplates, calculateTotalPoints } from '../utils/achievementEngine';
import AchievementBadge from './AchievementBadge';

interface AchievementProgressProps {
  user: User;
}

const AchievementProgress: React.FC<AchievementProgressProps> = ({ user }) => {
  const userAchievements = user.achievements || [];
  const unlockedIds = userAchievements.map(a => a.id);
  const totalPoints = calculateTotalPoints(userAchievements);
  const progressPercentage = (userAchievements.length / achievementTemplates.length) * 100;

  const unlockedAchievements = userAchievements;
  const lockedTemplates = achievementTemplates.filter(template => !unlockedIds.includes(template.id));
  const nextGoals = lockedTemplates.filter(template => {
    // Show achievements that are close to being unlocked
    if (template.type === 'completion') {
      return user.completedModules.length >= (template.condition.toString().match(/\d+/)?.[0] ? parseInt(template.condition.toString().match(/\d+/)[0]) - 2 : 0);
    }
    return true;
  }).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <Trophy className="w-5 h-5" />
            Achievement Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userAchievements.length}</div>
              <div className="text-sm text-gray-600">Unlocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalPoints}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {unlockedAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {unlockedAchievements.slice(0, 6).map((achievement) => (
                <AchievementBadge
                  key={achievement.id}
                  achievement={achievement}
                  size="md"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Goals */}
      {nextGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-500" />
              Next Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextGoals.map((template) => (
                <div
                  key={template.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-700">{template.title}</div>
                    <div className="text-sm text-gray-600">{template.description}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {template.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AchievementProgress;
