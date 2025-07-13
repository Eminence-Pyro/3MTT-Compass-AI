import { User, Achievement, AchievementTemplate } from '../types';

export const achievementTemplates: AchievementTemplate[] = [
  // Completion Achievements
  {
    id: 'first_module',
    type: 'completion',
    title: 'Getting Started',
    description: 'Complete your first learning module',
    icon: 'play',
    condition: (user) => user.completedModules.length >= 1,
    points: 10,
    rarity: 'common'
  },
  {
    id: 'five_modules',
    type: 'completion',
    title: 'Making Progress',
    description: 'Complete 5 learning modules',
    icon: 'target',
    condition: (user) => user.completedModules.length >= 5,
    points: 50,
    rarity: 'common'
  },
  {
    id: 'ten_modules',
    type: 'completion',
    title: 'Dedicated Learner',
    description: 'Complete 10 learning modules',
    icon: 'trophy',
    condition: (user) => user.completedModules.length >= 10,
    points: 100,
    rarity: 'rare'
  },
  
  // Streak Achievements
  {
    id: 'three_day_streak',
    type: 'streak',
    title: 'Consistent Learner',
    description: 'Learn for 3 days in a row',
    icon: 'flame',
    condition: (user) => calculateLearningStreak(user) >= 3,
    points: 30,
    rarity: 'common'
  },
  {
    id: 'week_streak',
    type: 'streak',
    title: 'Week Warrior',
    description: 'Learn for 7 days in a row',
    icon: 'zap',
    condition: (user) => calculateLearningStreak(user) >= 7,
    points: 100,
    rarity: 'rare'
  },
  
  // Level-up Achievements
  {
    id: 'level_intermediate',
    type: 'level-up',
    title: 'Skill Upgrade',
    description: 'Reach intermediate level',
    icon: 'trending-up',
    condition: (user) => user.skillLevel === 'intermediate',
    points: 75,
    rarity: 'rare'
  },
  {
    id: 'level_advanced',
    type: 'level-up',
    title: 'Expert Status',
    description: 'Reach advanced level',
    icon: 'crown',
    condition: (user) => user.skillLevel === 'advanced',
    points: 150,
    rarity: 'epic'
  },
  
  // Milestone Achievements
  {
    id: 'half_path_complete',
    type: 'milestone',
    title: 'Halfway There',
    description: 'Complete 50% of your learning path',
    icon: 'activity',
    condition: (user) => {
      if (!user.currentPath) return false;
      const totalModules = user.currentPath.modules.length;
      const completedCount = user.completedModules.length;
      return (completedCount / totalModules) >= 0.5;
    },
    points: 200,
    rarity: 'epic'
  },
  {
    id: 'path_complete',
    type: 'milestone',
    title: 'Path Master',
    description: 'Complete your entire learning path',
    icon: 'star',
    condition: (user) => {
      if (!user.currentPath) return false;
      const totalModules = user.currentPath.modules.length;
      const completedCount = user.completedModules.length;
      return completedCount >= totalModules;
    },
    points: 500,
    rarity: 'legendary'
  }
];

const calculateLearningStreak = (user: User): number => {
  // Mock calculation - in a real app, you'd track daily activity
  return Math.min(user.completedModules.length, 7);
};

export const checkForNewAchievements = (user: User, previousCompletedModules: string[]): Achievement[] => {
  const userAchievements = user.achievements || [];
  const unlockedAchievementIds = userAchievements.map(a => a.id);
  
  return achievementTemplates.filter(template => {
    // Skip if already unlocked
    if (unlockedAchievementIds.includes(template.id)) return false;
    
    // Check if condition is now met
    return template.condition(user);
  }).map(template => ({
    id: template.id,
    type: template.type,
    title: template.title,
    description: template.description,
    icon: template.icon,
    points: template.points,
    rarity: template.rarity,
    unlockedAt: new Date().toISOString()
  }));
};

export const calculateTotalPoints = (userAchievements: Achievement[]): number => {
  return userAchievements.reduce((total, achievement) => total + achievement.points, 0);
};

export const getRarityColor = (rarity: Achievement['rarity']): string => {
  switch (rarity) {
    case 'common': return 'text-gray-600 bg-gray-100';
    case 'rare': return 'text-blue-600 bg-blue-100';
    case 'epic': return 'text-purple-600 bg-purple-100';
    case 'legendary': return 'text-yellow-600 bg-yellow-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};
