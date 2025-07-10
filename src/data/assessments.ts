
import { Assessment, Question } from '../types';

// Software Development Questions
const fullStackQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the primary purpose of React hooks?',
    options: [
      'To style components',
      'To manage state and lifecycle in functional components',
      'To handle routing',
      'To optimize performance'
    ],
    correctAnswer: 1,
    topic: 'React',
    difficulty: 'intermediate'
  },
  {
    id: '2',
    question: 'Which HTTP method is typically used to create a new resource?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correctAnswer: 1,
    topic: 'Backend',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What does CSS Grid provide that Flexbox doesn\'t?',
    options: [
      'Better browser support',
      'Two-dimensional layout control',
      'Faster rendering',
      'Responsive design capabilities'
    ],
    correctAnswer: 1,
    topic: 'CSS',
    difficulty: 'intermediate'
  },
  {
    id: '4',
    question: 'In Python, what is the difference between a list and a tuple?',
    options: [
      'Lists are faster',
      'Tuples are mutable, lists are not',
      'Lists are mutable, tuples are immutable',
      'No difference'
    ],
    correctAnswer: 2,
    topic: 'Python',
    difficulty: 'beginner'
  },
  {
    id: '5',
    question: 'What is the purpose of middleware in Express.js?',
    options: [
      'To style the application',
      'To handle database connections',
      'To process requests between the client and server',
      'To manage user authentication only'
    ],
    correctAnswer: 2,
    topic: 'Node.js',
    difficulty: 'intermediate'
  }
];

// Data Science Questions
const dataScienceQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the main difference between supervised and unsupervised learning?',
    options: [
      'Supervised learning uses labeled data, unsupervised uses unlabeled data',
      'Supervised learning is faster than unsupervised learning',
      'Unsupervised learning requires more data',
      'There is no difference'
    ],
    correctAnswer: 0,
    topic: 'Machine Learning',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'Which Python library is primarily used for data manipulation and analysis?',
    options: ['NumPy', 'Pandas', 'Matplotlib', 'Scikit-learn'],
    correctAnswer: 1,
    topic: 'Python Libraries',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is overfitting in machine learning?',
    options: [
      'When a model performs well on training data but poorly on new data',
      'When a model is too simple',
      'When there is too much training data',
      'When the model trains too quickly'
    ],
    correctAnswer: 0,
    topic: 'Machine Learning',
    difficulty: 'intermediate'
  },
  {
    id: '4',
    question: 'Which algorithm is best for classification problems?',
    options: ['Linear Regression', 'Random Forest', 'K-Means', 'PCA'],
    correctAnswer: 1,
    topic: 'Algorithms',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is the purpose of cross-validation?',
    options: [
      'To increase training speed',
      'To evaluate model performance and prevent overfitting',
      'To reduce data size',
      'To visualize data'
    ],
    correctAnswer: 1,
    topic: 'Model Evaluation',
    difficulty: 'intermediate'
  }
];

// Data Analysis Questions
const dataAnalysisQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the primary purpose of data visualization?',
    options: [
      'To make data look pretty',
      'To communicate insights and patterns in data clearly',
      'To reduce data size',
      'To store data efficiently'
    ],
    correctAnswer: 1,
    topic: 'Data Visualization',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'Which SQL command is used to retrieve data from a database?',
    options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'],
    correctAnswer: 2,
    topic: 'SQL',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is a pivot table used for?',
    options: [
      'Storing data',
      'Summarizing and analyzing data',
      'Creating charts',
      'Database connections'
    ],
    correctAnswer: 1,
    topic: 'Data Analysis',
    difficulty: 'beginner'
  },
  {
    id: '4',
    question: 'Which chart type is best for showing trends over time?',
    options: ['Pie chart', 'Bar chart', 'Line chart', 'Scatter plot'],
    correctAnswer: 2,
    topic: 'Data Visualization',
    difficulty: 'beginner'
  },
  {
    id: '5',
    question: 'What is the difference between mean and median?',
    options: [
      'No difference',
      'Mean is the average, median is the middle value',
      'Median is the average, mean is the middle value',
      'Both are the same as mode'
    ],
    correctAnswer: 1,
    topic: 'Statistics',
    difficulty: 'beginner'
  }
];

// Cybersecurity Questions
const cybersecurityQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the CIA triad in cybersecurity?',
    options: [
      'Central Intelligence Agency principles',
      'Confidentiality, Integrity, Availability',
      'Computer, Internet, Applications',
      'Cyber, Information, Analysis'
    ],
    correctAnswer: 1,
    topic: 'Security Fundamentals',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'What is a firewall primarily used for?',
    options: [
      'Data storage',
      'Network monitoring and access control',
      'Email encryption',
      'Password management'
    ],
    correctAnswer: 1,
    topic: 'Network Security',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is social engineering in cybersecurity?',
    options: [
      'Building secure networks',
      'Manipulating people to divulge confidential information',
      'Developing security software',
      'Analyzing network traffic'
    ],
    correctAnswer: 1,
    topic: 'Security Threats',
    difficulty: 'intermediate'
  },
  {
    id: '4',
    question: 'What is the purpose of penetration testing?',
    options: [
      'To break into systems illegally',
      'To identify vulnerabilities before attackers do',
      'To install malware',
      'To monitor employee activity'
    ],
    correctAnswer: 1,
    topic: 'Ethical Hacking',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is two-factor authentication?',
    options: [
      'Using two passwords',
      'An additional layer of security requiring two forms of identification',
      'Two separate login pages',
      'Dual encryption methods'
    ],
    correctAnswer: 1,
    topic: 'Authentication',
    difficulty: 'beginner'
  }
];

// UI/UX Design Questions
const uiUxQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the main difference between UI and UX design?',
    options: [
      'UI focuses on visual elements, UX focuses on user experience',
      'UI is harder than UX',
      'UX is only about colors',
      'There is no difference'
    ],
    correctAnswer: 0,
    topic: 'Design Fundamentals',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'What is a wireframe?',
    options: [
      'A type of code',
      'A low-fidelity structural blueprint of a webpage or app',
      'A color scheme',
      'A font selection'
    ],
    correctAnswer: 1,
    topic: 'Design Process',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is the purpose of user personas?',
    options: [
      'To represent target users and guide design decisions',
      'To create attractive visuals',
      'To write code',
      'To test software bugs'
    ],
    correctAnswer: 0,
    topic: 'User Research',
    difficulty: 'beginner'
  },
  {
    id: '4',
    question: 'What is accessibility in web design?',
    options: [
      'Making websites load faster',
      'Ensuring websites are usable by people with disabilities',
      'Creating mobile-friendly designs',
      'Using bright colors'
    ],
    correctAnswer: 1,
    topic: 'Accessibility',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is A/B testing in UX design?',
    options: [
      'Testing two different versions to see which performs better',
      'Testing on two different devices',
      'Using two different designers',
      'Testing twice for accuracy'
    ],
    correctAnswer: 0,
    topic: 'Testing',
    difficulty: 'intermediate'
  }
];

// Product Management Questions
const productManagementQuestions: Question[] = [
  {
    id: '1',
    question: 'What is a product roadmap?',
    options: [
      'A map of the office',
      'A strategic document outlining product development over time',
      'A list of bugs to fix',
      'A marketing plan'
    ],
    correctAnswer: 1,
    topic: 'Product Strategy',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'What does MVP stand for in product management?',
    options: [
      'Most Valuable Player',
      'Minimum Viable Product',
      'Maximum Value Proposition',
      'Market Validation Process'
    ],
    correctAnswer: 1,
    topic: 'Product Development',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is the main purpose of user stories in Agile?',
    options: [
      'To document technical specifications',
      'To describe features from the user\'s perspective',
      'To track project timeline',
      'To assign tasks to developers'
    ],
    correctAnswer: 1,
    topic: 'Agile Methodology',
    difficulty: 'beginner'
  },
  {
    id: '4',
    question: 'What is product-market fit?',
    options: [
      'When the product fits in the market budget',
      'When the product satisfies strong market demand',
      'When the product is technically complete',
      'When the product has no competitors'
    ],
    correctAnswer: 1,
    topic: 'Product Strategy',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is a KPI in product management?',
    options: [
      'Key Performance Indicator',
      'Knowledge Process Integration',
      'Keep Product Improving',
      'Key Product Initiative'
    ],
    correctAnswer: 0,
    topic: 'Metrics',
    difficulty: 'beginner'
  }
];

// Quality Assurance Questions
const qualityAssuranceQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the main difference between manual and automated testing?',
    options: [
      'Manual testing is always better',
      'Manual testing is done by humans, automated testing uses tools',
      'Automated testing is always faster',
      'There is no difference'
    ],
    correctAnswer: 1,
    topic: 'Testing Types',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'What is a test case?',
    options: [
      'A container for storing tests',
      'A set of conditions to verify if a feature works correctly',
      'A type of software bug',
      'A testing tool'
    ],
    correctAnswer: 1,
    topic: 'Test Planning',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is regression testing?',
    options: [
      'Testing new features only',
      'Re-testing existing functionality after changes',
      'Testing for performance issues',
      'Testing user interface only'
    ],
    correctAnswer: 1,
    topic: 'Testing Methods',
    difficulty: 'intermediate'
  },
  {
    id: '4',
    question: 'What is the purpose of smoke testing?',
    options: [
      'To test fire safety systems',
      'To verify basic functionality before detailed testing',
      'To test under extreme conditions',
      'To test error messages'
    ],
    correctAnswer: 1,
    topic: 'Testing Strategies',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is API testing?',
    options: [
      'Testing user interfaces',
      'Testing application programming interfaces',
      'Testing network connections',
      'Testing database performance'
    ],
    correctAnswer: 1,
    topic: 'API Testing',
    difficulty: 'intermediate'
  }
];

// DevOps Questions
const devopsQuestions: Question[] = [
  {
    id: '1',
    question: 'What is the main goal of DevOps?',
    options: [
      'To reduce development costs',
      'To bridge the gap between development and operations teams',
      'To eliminate testing',
      'To use only cloud services'
    ],
    correctAnswer: 1,
    topic: 'DevOps Culture',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'What does CI/CD stand for?',
    options: [
      'Code Integration/Code Deployment',
      'Continuous Integration/Continuous Deployment',
      'Computer Integration/Computer Development',
      'Client Integration/Client Delivery'
    ],
    correctAnswer: 1,
    topic: 'CI/CD',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is containerization?',
    options: [
      'Packaging applications with their dependencies into containers',
      'Storing data in databases',
      'Creating virtual machines',
      'Building mobile applications'
    ],
    correctAnswer: 0,
    topic: 'Containerization',
    difficulty: 'intermediate'
  },
  {
    id: '4',
    question: 'What is Infrastructure as Code (IaC)?',
    options: [
      'Writing code for infrastructure management',
      'Managing infrastructure through code',
      'Both A and B',
      'None of the above'
    ],
    correctAnswer: 2,
    topic: 'Infrastructure',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is the purpose of monitoring in DevOps?',
    options: [
      'To track employee productivity',
      'To observe system performance and detect issues',
      'To write documentation',
      'To manage project timelines'
    ],
    correctAnswer: 1,
    topic: 'Monitoring',
    difficulty: 'beginner'
  }
];

// Cloud Computing Questions
const cloudComputingQuestions: Question[] = [
  {
    id: '1',
    question: 'What are the three main cloud service models?',
    options: [
      'IaaS, PaaS, SaaS',
      'Public, Private, Hybrid',
      'Small, Medium, Large',
      'Basic, Standard, Premium'
    ],
    correctAnswer: 0,
    topic: 'Cloud Models',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'What is the main advantage of cloud computing?',
    options: [
      'Lower initial costs and scalability',
      'Better security than on-premises',
      'Faster internet speeds',
      'No need for IT staff'
    ],
    correctAnswer: 0,
    topic: 'Cloud Benefits',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is serverless computing?',
    options: [
      'Computing without any servers',
      'Cloud provider manages servers, you focus on code',
      'Using only physical servers',
      'Computing on mobile devices'
    ],
    correctAnswer: 1,
    topic: 'Serverless',
    difficulty: 'intermediate'
  },
  {
    id: '4',
    question: 'What is auto-scaling in cloud computing?',
    options: [
      'Automatically adjusting resources based on demand',
      'Manually increasing server capacity',
      'Reducing costs automatically',
      'Backing up data automatically'
    ],
    correctAnswer: 0,
    topic: 'Scalability',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is a CDN (Content Delivery Network)?',
    options: [
      'A type of database',
      'A network of servers that deliver content efficiently',
      'A security protocol',
      'A programming language'
    ],
    correctAnswer: 1,
    topic: 'Content Delivery',
    difficulty: 'intermediate'
  }
];

// AI/ML Questions
const aiMlQuestions: Question[] = [
  {
    id: '1',
    question: 'What is artificial intelligence?',
    options: [
      'Computer programs that can perform tasks requiring human intelligence',
      'Only robots that look like humans',
      'Advanced calculators',
      'Virtual reality systems'
    ],
    correctAnswer: 0,
    topic: 'AI Fundamentals',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'What is a neural network?',
    options: [
      'A computer network',
      'A computing system inspired by biological neural networks',
      'A type of database',
      'A programming language'
    ],
    correctAnswer: 1,
    topic: 'Neural Networks',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is natural language processing (NLP)?',
    options: [
      'Processing only English language',
      'AI field focused on interaction between computers and human language',
      'A type of programming',
      'Speech recognition only'
    ],
    correctAnswer: 1,
    topic: 'NLP',
    difficulty: 'intermediate'
  },
  {
    id: '4',
    question: 'What is deep learning?',
    options: [
      'Learning in deep water',
      'A subset of machine learning using neural networks with multiple layers',
      'Advanced study techniques',
      'Underground computing'
    ],
    correctAnswer: 1,
    topic: 'Deep Learning',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is the purpose of training data in machine learning?',
    options: [
      'To test the final model',
      'To teach the algorithm to make predictions',
      'To store user information',
      'To backup the system'
    ],
    correctAnswer: 1,
    topic: 'Machine Learning',
    difficulty: 'beginner'
  }
];

// Game Development Questions
const gameDevQuestions: Question[] = [
  {
    id: '1',
    question: 'What is a game engine?',
    options: [
      'The computer running the game',
      'A software framework for developing games',
      'The graphics card',
      'The game controller'
    ],
    correctAnswer: 1,
    topic: 'Game Development',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'What is the main programming language used in Unity?',
    options: ['Python', 'Java', 'C#', 'JavaScript'],
    correctAnswer: 2,
    topic: 'Unity',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is a sprite in game development?',
    options: [
      'A type of ghost',
      'A 2D image or animation used in games',
      'A sound effect',
      'A programming function'
    ],
    correctAnswer: 1,
    topic: '2D Graphics',
    difficulty: 'beginner'
  },
  {
    id: '4',
    question: 'What is collision detection?',
    options: [
      'Detecting when game objects interact or touch',
      'Finding bugs in code',
      'Checking internet connection',
      'Testing game performance'
    ],
    correctAnswer: 0,
    topic: 'Game Physics',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is the game loop?',
    options: [
      'A bug that causes infinite loops',
      'The core structure that continuously updates and renders the game',
      'A circular game level',
      'Replaying the same level'
    ],
    correctAnswer: 1,
    topic: 'Game Architecture',
    difficulty: 'intermediate'
  }
];

// Animation Questions
const animationQuestions: Question[] = [
  {
    id: '1',
    question: 'What are the 12 principles of animation?',
    options: [
      'Rules for drawing cartoons',
      'Fundamental principles that make animation believable and appealing',
      'Types of animation software',
      'Animation file formats'
    ],
    correctAnswer: 1,
    topic: 'Animation Principles',
    difficulty: 'beginner'
  },
  {
    id: '2',
    question: 'What is keyframe animation?',
    options: [
      'Animation using only key colors',
      'Setting important frames and letting software fill in between',
      'Animation for keyboards',
      'Password-protected animation'
    ],
    correctAnswer: 1,
    topic: 'Animation Techniques',
    difficulty: 'beginner'
  },
  {
    id: '3',
    question: 'What is the difference between 2D and 3D animation?',
    options: [
      '2D uses flat images, 3D uses objects with depth',
      '2D is always better than 3D',
      '3D requires special glasses',
      'No difference'
    ],
    correctAnswer: 0,
    topic: 'Animation Types',
    difficulty: 'beginner'
  },
  {
    id: '4',
    question: 'What is motion graphics?',
    options: [
      'Graphics that move',
      'Animation focused on graphic design elements and text',
      'Fast-paced animations',
      'Graphics for mobile devices'
    ],
    correctAnswer: 1,
    topic: 'Motion Graphics',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    question: 'What is rigging in 3D animation?',
    options: [
      'Creating the skeleton structure for 3D models to animate',
      'Setting up lighting',
      'Creating textures',
      'Rendering final output'
    ],
    correctAnswer: 0,
    topic: '3D Animation',
    difficulty: 'intermediate'
  }
];

export const assessments: Assessment[] = [
  {
    id: 'fullstack-assessment',
    track: 'fullstack',
    questions: fullStackQuestions
  },
  {
    id: 'data-science-assessment',
    track: 'data-science',
    questions: dataScienceQuestions
  },
  {
    id: 'data-analysis-assessment',
    track: 'data-analysis',
    questions: dataAnalysisQuestions
  },
  {
    id: 'cybersecurity-assessment',
    track: 'cybersecurity',
    questions: cybersecurityQuestions
  },
  {
    id: 'ui-ux-assessment',
    track: 'ui-ux-design',
    questions: uiUxQuestions
  },
  {
    id: 'product-management-assessment',
    track: 'product-management',
    questions: productManagementQuestions
  },
  {
    id: 'quality-assurance-assessment',
    track: 'quality-assurance',
    questions: qualityAssuranceQuestions
  },
  {
    id: 'devops-assessment',
    track: 'devops',
    questions: devopsQuestions
  },
  {
    id: 'cloud-computing-assessment',
    track: 'cloud-computing',
    questions: cloudComputingQuestions
  },
  {
    id: 'ai-ml-assessment',
    track: 'ai-ml',
    questions: aiMlQuestions
  },
  {
    id: 'game-development-assessment',
    track: 'game-development',
    questions: gameDevQuestions
  },
  {
    id: 'animation-assessment',
    track: 'animation',
    questions: animationQuestions
  }
];
