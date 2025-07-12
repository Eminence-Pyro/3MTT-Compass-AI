
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Lock, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { achievements, Achievement, calculateTotalPoints } from '../utils/achievementEngine';
import AchievementBadge from './AchievementBadge';

interface AchievementProgressProps {
  user: User;
}

const AchievementProgress: React.FC<AchievementProgressProps> = ({ user }) => {
  const userAchievements = user.achievements || [];
  const unlockedIds = userAchievements.map(a => a.id);
  const totalPoints = calculateTotalPoints(userAchievements);
  const progressPercentage = (userAchievements.length / achievements.length) * 100;

  const unlockedAchievements = achievements.filter(a => unlockedIds.includes(a.id));
  const lockedAchievements = achievements.filter(a => !unlockedIds.includes(a.id));
  const nextAchievements = lockedAchievements.filter(a => {
    // Show achievements that are close to being unlocked
    if (a.type === 'completion') {
      return user.completedModules.length >= (a.condition.toString().match(/\d+/)?.[0] ? parseInt(a.condition.toString().match(/\d+/)[0]) - 2 : 0);
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
      {nextAchievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-500" />
              Next Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-700">{achievement.title}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {achievement.points} pts
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
