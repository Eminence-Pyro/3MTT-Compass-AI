
import { LearningModule, User } from '../types/index';
import { AssessmentResult } from '../types/assessment';
import { learningModules } from '../data/modules';
import { getTrackTags } from './trackTags';

export function generatePersonalizedPath(
  user: User,
  assessmentResult: AssessmentResult,
  track: string
): LearningModule[] {
  console.log('Generating personalized path for:', user.name);
  console.log('Assessment result:', assessmentResult);
  console.log('Track:', track);

  // Filter modules by track-relevant tags
  const trackModules = learningModules.filter(module => {
    const trackTags = getTrackTags(track);
    return module.tags.some(tag => trackTags.includes(tag));
  });

  // Separate internal 3MTT modules and external resources
  const internalModules = trackModules.filter(m => m.type === '3mtt-internal');
  const externalModules = trackModules.filter(m => m.type === 'external');

  console.log('Found internal modules:', internalModules.length);
  console.log('Found external modules:', externalModules.length);

  let recommendedModules: LearningModule[] = [];

  // Start with appropriate skill level modules
  const startingModules = internalModules.filter(module => {
    if (assessmentResult.skillLevel === 'beginner') {
      return module.difficulty === 'beginner';
    } else if (assessmentResult.skillLevel === 'intermediate') {
      return module.difficulty === 'beginner' || module.difficulty === 'intermediate';
    } else {
      return true; // Advanced users can access all levels
    }
  });

  // Add modules in dependency order
  const addedModuleIds = new Set<string>();
  const addModuleWithPrerequisites = (module: LearningModule) => {
    // First add prerequisites
    module.prerequisites.forEach(prereqId => {
      const prereq = internalModules.find(m => m.id === prereqId);
      if (prereq && !addedModuleIds.has(prereqId)) {
        recommendedModules.push(prereq);
        addedModuleIds.add(prereqId);
      }
    });
    
    // Then add the module itself
    if (!addedModuleIds.has(module.id)) {
      recommendedModules.push(module);
      addedModuleIds.add(module.id);
    }
  };

  // Add starting modules with prerequisites
  startingModules.forEach(addModuleWithPrerequisites);

  // Add external resources based on weaknesses and interests
  const relevantExternals = externalModules.filter(module => {
    // Prioritize modules that address weaknesses
    const addressesWeakness = assessmentResult.recommendedTopics.some(topic =>
      module.tags.some(tag => tag.toLowerCase().includes(topic))
    );
    
    // Include modules at appropriate difficulty
    const appropriateDifficulty = 
      (assessmentResult.skillLevel === 'beginner' && module.difficulty !== 'advanced') ||
      (assessmentResult.skillLevel === 'intermediate') ||
      (assessmentResult.skillLevel === 'advanced');

    return addressesWeakness || appropriateDifficulty;
  });

  // Interleave external resources with internal modules
  const finalPath: LearningModule[] = [];
  let internalIndex = 0;
  let externalIndex = 0;

  while (internalIndex < recommendedModules.length || externalIndex < relevantExternals.length) {
    // Add 2 internal modules
    for (let i = 0; i < 2 && internalIndex < recommendedModules.length; i++) {
      finalPath.push(recommendedModules[internalIndex++]);
    }
    
    // Add 1 external resource
    if (externalIndex < relevantExternals.length) {
      finalPath.push(relevantExternals[externalIndex++]);
    }
  }

  console.log('Generated path with', finalPath.length, 'modules');
  return finalPath.slice(0, 12); // Limit to 12 modules for MVP
}
