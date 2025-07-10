
export function getTrackTags(track: string): string[] {
  switch (track) {
    case 'fullstack':
      return ['html', 'css', 'javascript', 'react', 'python', 'django', 'nodejs', 'express', 'frontend', 'backend', 'software-development'];
    case 'data-science':
      return ['python', 'data-science', 'machine-learning', 'statistics', 'visualization', 'tensorflow', 'algorithms', 'neural-networks'];
    case 'data-analysis':
      return ['data-analysis', 'excel', 'statistics', 'visualization', 'sql', 'databases', 'tableau', 'powerbi', 'business-intelligence'];
    case 'cybersecurity':
      return ['cybersecurity', 'security', 'networking', 'ethical-hacking', 'penetration-testing', 'network-security', 'fundamentals'];
    case 'ui-ux-design':
      return ['ui-ux', 'design-principles', 'figma', 'prototyping', 'wireframes', 'user-research', 'usability-testing', 'ui-design'];
    case 'product-management':
      return ['product-management', 'strategy', 'roadmapping', 'agile', 'scrum', 'analytics', 'metrics', 'kpi', 'project-management'];
    case 'quality-assurance':
      return ['quality-assurance', 'software-testing', 'manual-testing', 'test-automation', 'selenium', 'api-testing', 'performance-testing'];
    case 'devops':
      return ['devops', 'ci-cd', 'automation', 'infrastructure', 'docker', 'containers', 'jenkins', 'kubernetes', 'pipeline'];
    case 'cloud-computing':
      return ['cloud-computing', 'aws', 'azure', 'gcp', 'serverless', 'lambda', 'azure-functions', 'saas', 'paas', 'iaas'];
    case 'ai-ml':
      return ['artificial-intelligence', 'ai-ml', 'machine-learning', 'tensorflow', 'keras', 'neural-networks', 'nlp', 'text-processing'];
    case 'game-development':
      return ['game-development', 'unity', 'game-design', 'c-sharp', '3d-games', 'mobile-games', 'mechanics', 'storytelling'];
    case 'animation':
      return ['animation', '2d-animation', '3d-animation', 'after-effects', 'motion-graphics', 'blender', 'modeling', 'vfx'];
    default:
      return [];
  }
}
