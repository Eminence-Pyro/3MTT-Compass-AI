
import { User, LearningModule } from '../types';
import { UserAnalytics, ModuleAnalytics } from '../types/analytics';

export const calculateUserAnalytics = (user: User): UserAnalytics => {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  // Mock calculation based on user progress
  const totalModules = user.currentPath?.modules.length || 0;
  const completedCount = user.completedModules.length;
  const completionRate = totalModules > 0 ? (completedCount / totalModules) * 100 : 0;
  
  // Estimate time spent (15 min per completed module + 5 min per viewed module)
  const estimatedTimeSpent = completedCount * 15 + Math.max(0, totalModules - completedCount) * 5;
  
  // Calculate learning streak (mock for now)
  const learningStreak = Math.min(completedCount, 7); // Max 7 days for demo
  
  return {
    userId: user.id,
    sessionStart: weekAgo.toISOString(),
    totalTimeSpent: estimatedTimeSpent,
    modulesViewed: user.currentPath?.modules.slice(0, completedCount + 2).map(m => m.id) || [],
    assessmentAttempts: user.assessmentCompleted ? 1 : 0,
    completionRate,
    learningStreak,
    lastActiveDate: today.toISOString()
  };
};

export const generateWeeklyProgress = (user: User) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const completedCount = user.completedModules.length;
  
  // Distribute completed modules across the week for visualization
  return days.map((day, index) => {
    const modulesForDay = Math.floor(completedCount / 7) + (index < completedCount % 7 ? 1 : 0);
    const timeForDay = modulesForDay * 20 + Math.random() * 15; // 20-35 min per module
    
    return {
      day,
      modules: modulesForDay,
      time: Math.round(timeForDay)
    };
  });
};

export const generateSkillDistribution = (user: User) => {
  if (!user.currentPath) return [];
  
  const skillCounts: Record<string, number> = {};
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];
  
  // Count modules by tags/skills
  user.currentPath.modules.forEach(module => {
    module.tags.forEach(tag => {
      skillCounts[tag] = (skillCounts[tag] || 0) + 1;
    });
  });
  
  // Convert to chart data
  return Object.entries(skillCounts)
    .map(([skill, count], index) => ({
      name: skill.charAt(0).toUpperCase() + skill.slice(1),
      value: count,
      color: colors[index % colors.length]
    }))
    .slice(0, 6); // Show top 6 skills
};

export const calculateLearningInsights = (analytics: UserAnalytics, user: User) => {
  const insights = [];
  
  if (analytics.learningStreak >= 3) {
    insights.push(`Great job! You're on a ${analytics.learningStreak}-day learning streak! 🔥`);
  }
  
  if (analytics.completionRate > 50) {
    insights.push("You're making excellent progress on your learning path! 📈");
  }
  
  if (analytics.totalTimeSpent > 100) {
    insights.push(`You've invested ${analytics.totalTimeSpent} minutes in learning this week! ⏰`);
  }
  
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour <= 10) {
    insights.push("Morning learner! Studies show retention is higher in the morning. 🌅");
  }
  
  return insights;
};
