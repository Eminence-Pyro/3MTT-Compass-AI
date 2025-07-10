
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, Trophy, Target, TrendingUp } from 'lucide-react';
import { User } from '../types';

interface SocialShareProps {
  user: User;
  achievement: {
    type: 'completion' | 'streak' | 'level-up' | 'milestone';
    title: string;
    description: string;
  };
}

const SocialShare: React.FC<SocialShareProps> = ({ user, achievement }) => {
  const shareText = `🎉 Just ${achievement.title} on 3MTT Compass AI! ${achievement.description} #3MTTNigeria #TechEducation #LearningJourney`;
  
  const shareToTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const shareToLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
  };

  const getAchievementIcon = () => {
    switch (achievement.type) {
      case 'completion': return <Trophy className="w-8 h-8 text-yellow-500" />;
      case 'streak': return <TrendingUp className="w-8 h-8 text-green-500" />;
      case 'level-up': return <Target className="w-8 h-8 text-blue-500" />;
      case 'milestone': return <Trophy className="w-8 h-8 text-purple-500" />;
      default: return <Share2 className="w-8 h-8 text-gray-500" />;
    }
  };

  return (
    <Card className="border-2 border-green-200 bg-green-50">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2">
          {getAchievementIcon()}
        </div>
        <CardTitle className="text-green-700">{achievement.title}!</CardTitle>
        <p className="text-sm text-gray-600">{achievement.description}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-3">Share your achievement:</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={shareToTwitter} variant="outline" size="sm">
              Twitter
            </Button>
            <Button onClick={shareToLinkedIn} variant="outline" size="sm">
              LinkedIn
            </Button>
            <Button onClick={copyToClipboard} variant="outline" size="sm">
              Copy Link
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialShare;
