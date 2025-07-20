
import { LearningModule } from '../types/index';

export const learningModules: LearningModule[] = [
  // Software Development (Full Stack)
  {
    id: '3mtt-html-basics',
    title: '3MTT HTML Fundamentals',
    description: 'Learn the building blocks of web development with HTML5',
    type: '3mtt-internal',
    estimatedTime: 120,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['html', 'web-development', 'frontend', 'software-development'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-css-styling',
    title: '3MTT CSS Styling & Layout',
    description: 'Master CSS for beautiful, responsive web designs',
    type: '3mtt-internal',
    estimatedTime: 150,
    difficulty: 'beginner',
    prerequisites: ['3mtt-html-basics'],
    tags: ['css', 'styling', 'responsive-design', 'frontend', 'software-development'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-javascript-intro',
    title: '3MTT JavaScript Programming',
    description: 'Introduction to JavaScript programming concepts',
    type: '3mtt-internal',
    estimatedTime: 180,
    difficulty: 'beginner',
    prerequisites: ['3mtt-html-basics'],
    tags: ['javascript', 'programming', 'frontend', 'software-development'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-react-fundamentals',
    title: '3MTT React Development',
    description: 'Build dynamic user interfaces with React',
    type: '3mtt-internal',
    estimatedTime: 240,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-javascript-intro'],
    tags: ['react', 'frontend', 'components', 'software-development'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-python-basics',
    title: '3MTT Python Programming',
    description: 'Learn Python programming from the ground up',
    type: '3mtt-internal',
    estimatedTime: 200,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['python', 'programming', 'backend', 'software-development'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-django-framework',
    title: '3MTT Django Web Framework',
    description: 'Build robust web applications with Django',
    type: '3mtt-internal',
    estimatedTime: 300,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-python-basics'],
    tags: ['django', 'python', 'backend', 'web-framework', 'software-development'],
    lastUpdated: '2024-12-01'
  },

  // Data Science
  {
    id: '3mtt-data-science-intro',
    title: '3MTT Introduction to Data Science',
    description: 'Fundamentals of data science and its applications',
    type: '3mtt-internal',
    estimatedTime: 180,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['data-science', 'statistics', 'python', 'analytics'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-machine-learning',
    title: '3MTT Machine Learning Fundamentals',
    description: 'Introduction to machine learning algorithms and techniques',
    type: '3mtt-internal',
    estimatedTime: 360,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-data-science-intro', '3mtt-python-basics'],
    tags: ['machine-learning', 'data-science', 'python', 'algorithms'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-deep-learning',
    title: '3MTT Deep Learning with Neural Networks',
    description: 'Advanced neural networks and deep learning concepts',
    type: '3mtt-internal',
    estimatedTime: 400,
    difficulty: 'advanced',
    prerequisites: ['3mtt-machine-learning'],
    tags: ['deep-learning', 'neural-networks', 'data-science', 'tensorflow'],
    lastUpdated: '2024-12-01'
  },

  // Data Analysis and Visualization
  {
    id: '3mtt-data-analysis-basics',
    title: '3MTT Data Analysis Fundamentals',
    description: 'Learn to analyze and interpret data effectively',
    type: '3mtt-internal',
    estimatedTime: 200,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['data-analysis', 'excel', 'statistics', 'visualization'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-tableau-powerbi',
    title: '3MTT Business Intelligence Tools',
    description: 'Master Tableau and Power BI for data visualization',
    type: '3mtt-internal',
    estimatedTime: 250,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-data-analysis-basics'],
    tags: ['tableau', 'powerbi', 'data-visualization', 'business-intelligence'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-sql-databases',
    title: '3MTT SQL and Database Management',
    description: 'Query databases and manage data with SQL',
    type: '3mtt-internal',
    estimatedTime: 180,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['sql', 'databases', 'data-analysis', 'mysql', 'postgresql'],
    lastUpdated: '2024-12-01'
  },

  // Cybersecurity
  {
    id: '3mtt-cybersecurity-fundamentals',
    title: '3MTT Cybersecurity Fundamentals',
    description: 'Essential cybersecurity concepts and practices',
    type: '3mtt-internal',
    estimatedTime: 200,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['cybersecurity', 'security', 'networking', 'fundamentals'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-ethical-hacking',
    title: '3MTT Ethical Hacking and Penetration Testing',
    description: 'Learn ethical hacking techniques and penetration testing',
    type: '3mtt-internal',
    estimatedTime: 320,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-cybersecurity-fundamentals'],
    tags: ['ethical-hacking', 'penetration-testing', 'cybersecurity', 'kali-linux'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-network-security',
    title: '3MTT Network Security',
    description: 'Secure network infrastructure and protocols',
    type: '3mtt-internal',
    estimatedTime: 280,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-cybersecurity-fundamentals'],
    tags: ['network-security', 'firewalls', 'vpn', 'cybersecurity'],
    lastUpdated: '2024-12-01'
  },

  // UI/UX Design
  {
    id: '3mtt-design-principles',
    title: '3MTT Design Principles and Theory',
    description: 'Fundamental design principles and color theory',
    type: '3mtt-internal',
    estimatedTime: 150,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['design-principles', 'ui-ux', 'color-theory', 'typography'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-figma-prototyping',
    title: '3MTT Figma and Prototyping',
    description: 'Create wireframes and prototypes using Figma',
    type: '3mtt-internal',
    estimatedTime: 200,
    difficulty: 'beginner',
    prerequisites: ['3mtt-design-principles'],
    tags: ['figma', 'prototyping', 'wireframes', 'ui-ux'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-user-research',
    title: '3MTT User Research and Testing',
    description: 'Conduct user research and usability testing',
    type: '3mtt-internal',
    estimatedTime: 180,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-design-principles'],
    tags: ['user-research', 'usability-testing', 'ux', 'user-personas'],
    lastUpdated: '2024-12-01'
  },

  // Product Management
  {
    id: '3mtt-product-fundamentals',
    title: '3MTT Product Management Fundamentals',
    description: 'Core concepts of product management and strategy',
    type: '3mtt-internal',
    estimatedTime: 180,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['product-management', 'strategy', 'roadmapping', 'agile'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-agile-scrum',
    title: '3MTT Agile and Scrum Methodologies',
    description: 'Master agile development and scrum frameworks',
    type: '3mtt-internal',
    estimatedTime: 160,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['agile', 'scrum', 'product-management', 'project-management'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-product-analytics',
    title: '3MTT Product Analytics and Metrics',
    description: 'Track and analyze product performance metrics',
    type: '3mtt-internal',
    estimatedTime: 200,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-product-fundamentals'],
    tags: ['analytics', 'metrics', 'product-management', 'kpi'],
    lastUpdated: '2024-12-01'
  },

  // Quality Assurance
  {
    id: '3mtt-software-testing-basics',
    title: '3MTT Software Testing Fundamentals',
    description: 'Introduction to software testing principles and practices',
    type: '3mtt-internal',
    estimatedTime: 160,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['software-testing', 'quality-assurance', 'manual-testing', 'test-cases'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-test-automation',
    title: '3MTT Test Automation with Selenium',
    description: 'Automate testing processes using Selenium and other tools',
    type: '3mtt-internal',
    estimatedTime: 240,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-software-testing-basics'],
    tags: ['test-automation', 'selenium', 'quality-assurance', 'automated-testing'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-api-testing',
    title: '3MTT API Testing and Performance Testing',
    description: 'Test APIs and perform load/performance testing',
    type: '3mtt-internal',
    estimatedTime: 200,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-software-testing-basics'],
    tags: ['api-testing', 'performance-testing', 'postman', 'quality-assurance'],
    lastUpdated: '2024-12-01'
  },

  // DevOps
  {
    id: '3mtt-devops-fundamentals',
    title: '3MTT DevOps Fundamentals',
    description: 'Introduction to DevOps culture and practices',
    type: '3mtt-internal',
    estimatedTime: 180,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['devops', 'ci-cd', 'automation', 'infrastructure'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-docker-containers',
    title: '3MTT Docker and Containerization',
    description: 'Master Docker and container technologies',
    type: '3mtt-internal',
    estimatedTime: 220,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-devops-fundamentals'],
    tags: ['docker', 'containers', 'devops', 'kubernetes'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-jenkins-cicd',
    title: '3MTT CI/CD with Jenkins',
    description: 'Build continuous integration and deployment pipelines',
    type: '3mtt-internal',
    estimatedTime: 250,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-devops-fundamentals'],
    tags: ['jenkins', 'ci-cd', 'devops', 'automation', 'pipeline'],
    lastUpdated: '2024-12-01'
  },

  // Cloud Computing
  {
    id: '3mtt-cloud-fundamentals',
    title: '3MTT Cloud Computing Fundamentals',
    description: 'Introduction to cloud computing concepts and services',
    type: '3mtt-internal',
    estimatedTime: 180,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['cloud-computing', 'aws', 'azure', 'gcp', 'saas', 'paas', 'iaas'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-aws-essentials',
    title: '3MTT AWS Cloud Services',
    description: 'Master essential AWS services and architecture',
    type: '3mtt-internal',
    estimatedTime: 300,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-cloud-fundamentals'],
    tags: ['aws', 'ec2', 's3', 'lambda', 'cloud-computing'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-serverless-computing',
    title: '3MTT Serverless Computing',
    description: 'Build serverless applications and functions',
    type: '3mtt-internal',
    estimatedTime: 200,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-cloud-fundamentals'],
    tags: ['serverless', 'lambda', 'azure-functions', 'cloud-computing'],
    lastUpdated: '2024-12-01'
  },

  // AI/ML
  {
    id: '3mtt-ai-fundamentals',
    title: '3MTT Artificial Intelligence Fundamentals',
    description: 'Introduction to AI concepts and applications',
    type: '3mtt-internal',
    estimatedTime: 200,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['artificial-intelligence', 'ai-ml', 'machine-learning', 'nlp'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-tensorflow-keras',
    title: '3MTT TensorFlow and Keras',
    description: 'Build neural networks with TensorFlow and Keras',
    type: '3mtt-internal',
    estimatedTime: 320,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-ai-fundamentals', '3mtt-python-basics'],
    tags: ['tensorflow', 'keras', 'neural-networks', 'ai-ml'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-nlp-processing',
    title: '3MTT Natural Language Processing',
    description: 'Process and analyze text data with NLP techniques',
    type: '3mtt-internal',
    estimatedTime: 280,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-ai-fundamentals'],
    tags: ['nlp', 'text-processing', 'ai-ml', 'sentiment-analysis'],
    lastUpdated: '2024-12-01'
  },

  // Game Development
  {
    id: '3mtt-game-design-basics',
    title: '3MTT Game Design Fundamentals',
    description: 'Core concepts of game design and mechanics',
    type: '3mtt-internal',
    estimatedTime: 180,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['game-design', 'game-development', 'mechanics', 'storytelling'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-unity-development',
    title: '3MTT Unity Game Development',
    description: 'Create games using Unity game engine',
    type: '3mtt-internal',
    estimatedTime: 350,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-game-design-basics'],
    tags: ['unity', 'game-development', 'c-sharp', '3d-games'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-mobile-game-dev',
    title: '3MTT Mobile Game Development',
    description: 'Develop games for mobile platforms',
    type: '3mtt-internal',
    estimatedTime: 300,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-unity-development'],
    tags: ['mobile-games', 'game-development', 'android', 'ios'],
    lastUpdated: '2024-12-01'
  },

  // Animation
  {
    id: '3mtt-animation-principles',
    title: '3MTT Animation Principles',
    description: 'Fundamental principles of animation and motion',
    type: '3mtt-internal',
    estimatedTime: 200,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['animation', '2d-animation', 'principles', 'timing'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-after-effects',
    title: '3MTT After Effects Motion Graphics',
    description: 'Create motion graphics and visual effects',
    type: '3mtt-internal',
    estimatedTime: 280,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-animation-principles'],
    tags: ['after-effects', 'motion-graphics', 'animation', 'vfx'],
    lastUpdated: '2024-12-01'
  },
  {
    id: '3mtt-3d-animation',
    title: '3MTT 3D Animation with Blender',
    description: 'Create 3D animations and models using Blender',
    type: '3mtt-internal',
    estimatedTime: 350,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-animation-principles'],
    tags: ['3d-animation', 'blender', 'modeling', 'animation'],
    lastUpdated: '2024-12-01'
  },

  // External Resources (relevant to multiple tracks)
  {
    id: 'ext-git-github',
    title: 'Git & GitHub Crash Course',
    description: 'Version control essentials for developers',
    type: 'external',
    url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    estimatedTime: 50,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['git', 'github', 'version-control', 'software-development'],
    source: 'YouTube - freeCodeCamp',
    lastUpdated: '2024-11-10'
  },
  {
    id: 'ext-python-data-science',
    title: 'Python for Data Science Complete Course',
    description: 'Comprehensive Python course for data science',
    type: 'external',
    url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    estimatedTime: 180,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['python', 'data-science', 'pandas', 'numpy'],
    source: 'YouTube - freeCodeCamp',
    lastUpdated: '2024-11-15'
  },
  {
    id: 'ext-aws-cloud-practitioner',
    title: 'AWS Cloud Practitioner Certification Course',
    description: 'Prepare for AWS Cloud Practitioner certification',
    type: 'external',
    url: 'https://www.youtube.com/watch?v=3hLmDS179YE',
    estimatedTime: 240,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['aws', 'cloud-computing', 'certification'],
    source: 'YouTube - freeCodeCamp',
    lastUpdated: '2024-11-20'
  },
  {
    id: 'ext-figma-ui-design',
    title: 'Complete Figma UI Design Course',
    description: 'Master UI design with Figma from scratch',
    type: 'external',
    url: 'https://www.youtube.com/watch?v=FTlczfEDBOA',
    estimatedTime: 150,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['figma', 'ui-design', 'ui-ux', 'prototyping'],
    source: 'YouTube - DesignCourse',
    lastUpdated: '2024-11-18'
  },
  {
    id: 'ext-cybersecurity-basics',
    title: 'Cybersecurity Fundamentals Course',
    description: 'Introduction to cybersecurity concepts and practices',
    type: 'external',
    url: 'https://www.coursera.org/learn/intro-cyber-security',
    estimatedTime: 200,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['cybersecurity', 'security', 'fundamentals'],
    source: 'Coursera - IBM',
    lastUpdated: '2024-11-25'
  }
];
