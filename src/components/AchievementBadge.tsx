
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Play, Target, Flame, Zap, TrendingUp, Crown, Activity, Star } from 'lucide-react';
import { Achievement } from '../types';
import { getRarityColor } from '../utils/achievementEngine';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  size = 'md', 
  showDescription = false 
}) => {
  const getIcon = (iconName: string) => {
    const iconProps = {
      className: size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-6 h-6'
    };

    switch (iconName) {
      case 'play': return <Play {...iconProps} />;
      case 'target': return <Target {...iconProps} />;
      case 'trophy': return <Trophy {...iconProps} />;
      case 'flame': return <Flame {...iconProps} />;
      case 'zap': return <Zap {...iconProps} />;
      case 'trending-up': return <TrendingUp {...iconProps} />;
      case 'crown': return <Crown {...iconProps} />;
      case 'activity': return <Activity {...iconProps} />;
      case 'star': return <Star {...iconProps} />;
      default: return <Trophy {...iconProps} />;
    }
  };

  const rarityStyles = getRarityColor(achievement.rarity);

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${rarityStyles}`}>
        {getIcon(achievement.icon)}
        <span className="font-medium">{achievement.title}</span>
      </div>
    );
  }

  if (showDescription) {
    return (
      <Card className={`border-2 ${achievement.rarity === 'legendary' ? 'border-yellow-300' : achievement.rarity === 'epic' ? 'border-purple-300' : achievement.rarity === 'rare' ? 'border-blue-300' : 'border-gray-300'}`}>
        <CardContent className="p-4 text-center">
          <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${rarityStyles}`}>
            {getIcon(achievement.icon)}
          </div>
          <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-xs">
              {achievement.points} points
            </Badge>
            <Badge className={`text-xs capitalize ${rarityStyles}`}>
              {achievement.rarity}
            </Badge>
          </div>
          {achievement.unlockedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${rarityStyles}`}>
      {getIcon(achievement.icon)}
      <div>
        <div className="font-medium text-sm">{achievement.title}</div>
        <div className="text-xs opacity-75">{achievement.points} pts</div>
      </div>
    </div>
  );
};

export default AchievementBadge;
