
import { LearningModule, User, Question } from '../types';
import { learningModules } from '../data/modules';

export interface AssessmentResult {
  score: number;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
}

export function analyzeAssessment(
  answers: number[],
  questions: Question[]
): AssessmentResult {
  const score = answers.reduce((acc, answer, index) => {
    return acc + (answer === questions[index].correctAnswer ? 1 : 0);
  }, 0);
  
  const percentage = (score / questions.length) * 100;
  
  let skillLevel: 'beginner' | 'intermediate' | 'advanced';
  if (percentage >= 80) skillLevel = 'advanced';
  else if (percentage >= 60) skillLevel = 'intermediate';
  else skillLevel = 'beginner';

  // Analyze strengths and weaknesses by topic
  const topicPerformance: { [key: string]: { correct: number; total: number } } = {};
  
  questions.forEach((question, index) => {
    const topic = question.topic;
    if (!topicPerformance[topic]) {
      topicPerformance[topic] = { correct: 0, total: 0 };
    }
    topicPerformance[topic].total++;
    if (answers[index] === question.correctAnswer) {
      topicPerformance[topic].correct++;
    }
  });

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const recommendedTopics: string[] = [];

  Object.entries(topicPerformance).forEach(([topic, performance]) => {
    const topicPercentage = (performance.correct / performance.total) * 100;
    if (topicPercentage >= 70) {
      strengths.push(topic);
    } else {
      weaknesses.push(topic);
      recommendedTopics.push(topic.toLowerCase());
    }
  });

  return {
    score: percentage,
    skillLevel,
    strengths,
    weaknesses,
    recommendedTopics
  };
}

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

function getTrackTags(track: string): string[] {
  switch (track) {
    case 'fullstack':
      return ['html', 'css', 'javascript', 'react', 'python', 'django', 'nodejs', 'express', 'frontend', 'backend'];
    case 'data-science':
      return ['python', 'data-analysis', 'machine-learning', 'statistics', 'visualization'];
    case 'cybersecurity':
      return ['security', 'networking', 'ethical-hacking', 'cryptography'];
    case 'product-design':
      return ['ui', 'ux', 'design', 'prototyping', 'user-research'];
    case 'mobile-dev':
      return ['react-native', 'flutter', 'ios', 'android', 'mobile'];
    default:
      return [];
  }
}

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
