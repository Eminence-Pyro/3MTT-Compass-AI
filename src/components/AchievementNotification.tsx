
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Share2 } from 'lucide-react';
import { Achievement, User } from '../types/index';
import AchievementBadge from './AchievementBadge';
import SocialShare from './SocialShare';

interface AchievementNotificationProps {
  achievements: Achievement[];
  user: User;
  onClose: () => void;
  onShare?: (achievement: Achievement) => void;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievements,
  user,
  onClose,
  onShare
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (achievements.length === 0) {
      onClose();
      return;
    }

    // Auto-advance to next achievement after 5 seconds
    const timer = setTimeout(() => {
      if (currentIndex < achievements.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onClose();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, achievements.length, onClose]);

  if (achievements.length === 0) return null;

  const currentAchievement = achievements[currentIndex];

  // Create a compatible achievement object for SocialShare
  const shareableAchievement = {
    type: currentAchievement.type as 'completion' | 'streak' | 'level-up' | 'milestone',
    title: currentAchievement.title,
    description: currentAchievement.description
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full bg-gradient-to-br from-green-50 to-orange-50 border-2 border-green-200 shadow-xl">
        {!showShare ? (
          <>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-green-700 mb-2">
                    🎉 Achievement Unlocked!
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <AchievementBadge 
                achievement={currentAchievement} 
                size="lg" 
                showDescription={true}
              />
              
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => setShowShare(true)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Achievement
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Continue Learning
                </Button>
              </div>

              {achievements.length > 1 && (
                <div className="flex justify-center gap-1 mt-4">
                  {achievements.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentIndex ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Share Your Achievement</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShare(false)}
                className="text-gray-500"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <SocialShare
              user={user}
              achievement={shareableAchievement}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default AchievementNotification;
