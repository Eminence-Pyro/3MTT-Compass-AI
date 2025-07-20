
import { LearningModule, User } from '../types/index';
import { learningModules } from '../data/modules';
import { getTrackTags } from './trackTags';

export function adaptLearningPath(
  currentPath: LearningModule[],
  completedModules: string[],
  user: User
): LearningModule[] {
  console.log('Adapting learning path for user:', user.name);
  console.log('Completed modules:', completedModules.length);
  
  // Remove completed modules
  const remainingModules = currentPath.filter(module => 
    !completedModules.includes(module.id)
  );

  // If user is progressing well, suggest more advanced content
  const completionRate = completedModules.length / currentPath.length;
  if (completionRate > 0.6 && user.skillLevel !== 'advanced') {
    // Add some advanced modules
    const advancedModules = learningModules.filter(module =>
      module.difficulty === 'advanced' &&
      module.tags.some(tag => getTrackTags(user.track).includes(tag)) &&
      !currentPath.some(existing => existing.id === module.id)
    );
    
    return [...remainingModules, ...advancedModules.slice(0, 3)];
  }

  return remainingModules;
}
