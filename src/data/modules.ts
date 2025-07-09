
import { LearningModule } from '../types';

export const learningModules: LearningModule[] = [
  // 3MTT Internal Modules
  {
    id: '3mtt-html-basics',
    title: '3MTT HTML Fundamentals',
    description: 'Learn the building blocks of web development with HTML5',
    type: '3mtt-internal',
    estimatedTime: 120,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['html', 'web-development', 'frontend'],
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
    tags: ['css', 'styling', 'responsive-design'],
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
    tags: ['javascript', 'programming', 'frontend'],
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
    tags: ['react', 'frontend', 'components'],
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
    tags: ['python', 'programming', 'backend'],
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
    tags: ['django', 'python', 'backend', 'web-framework'],
    lastUpdated: '2024-12-01'
  },

  // External Resources
  {
    id: 'ext-js-async-await',
    title: 'JavaScript Async/Await Mastery',
    description: 'Complete guide to asynchronous JavaScript programming',
    type: 'external',
    url: 'https://www.youtube.com/watch?v=V_Kr9OSfDeU',
    estimatedTime: 45,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-javascript-intro'],
    tags: ['javascript', 'async', 'promises'],
    source: 'YouTube - JavaScript Mastery',
    lastUpdated: '2024-11-15'
  },
  {
    id: 'ext-react-hooks',
    title: 'React Hooks Complete Guide',
    description: 'Master useState, useEffect, and custom hooks',
    type: 'external',
    url: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
    estimatedTime: 60,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-react-fundamentals'],
    tags: ['react', 'hooks', 'state-management'],
    source: 'YouTube - Ben Awad',
    lastUpdated: '2024-11-20'
  },
  {
    id: 'ext-css-grid',
    title: 'CSS Grid Layout Complete Guide',
    description: 'Master CSS Grid for modern web layouts',
    type: 'external',
    url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
    estimatedTime: 90,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-css-styling'],
    tags: ['css', 'layout', 'grid'],
    source: 'CSS-Tricks',
    lastUpdated: '2024-12-01'
  },
  {
    id: 'ext-python-oop',
    title: 'Python Object-Oriented Programming',
    description: 'Deep dive into Python classes and inheritance',
    type: 'external',
    url: 'https://realpython.com/python3-object-oriented-programming/',
    estimatedTime: 75,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-python-basics'],
    tags: ['python', 'oop', 'classes'],
    source: 'Real Python',
    lastUpdated: '2024-11-25'
  },
  {
    id: 'ext-django-rest',
    title: 'Django REST Framework Tutorial',
    description: 'Build powerful APIs with Django REST Framework',
    type: 'external',
    url: 'https://www.django-rest-framework.org/tutorial/',
    estimatedTime: 120,
    difficulty: 'advanced',
    prerequisites: ['3mtt-django-framework'],
    tags: ['django', 'api', 'rest', 'backend'],
    source: 'Django REST Framework Docs',
    lastUpdated: '2024-11-30'
  },
  {
    id: 'ext-git-github',
    title: 'Git & GitHub Crash Course',
    description: 'Version control essentials for developers',
    type: 'external',
    url: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
    estimatedTime: 50,
    difficulty: 'beginner',
    prerequisites: [],
    tags: ['git', 'github', 'version-control'],
    source: 'YouTube - freeCodeCamp',
    lastUpdated: '2024-11-10'
  },
  {
    id: 'ext-responsive-design',
    title: 'Responsive Web Design Principles',
    description: 'Create websites that work on all devices',
    type: 'external',
    url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design',
    estimatedTime: 80,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-css-styling'],
    tags: ['css', 'responsive', 'mobile-first'],
    source: 'MDN Web Docs',
    lastUpdated: '2024-11-28'
  },
  {
    id: 'ext-node-express',
    title: 'Node.js & Express.js Fundamentals',
    description: 'Build server-side applications with Node.js',
    type: 'external',
    url: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
    estimatedTime: 180,
    difficulty: 'intermediate',
    prerequisites: ['3mtt-javascript-intro'],
    tags: ['nodejs', 'express', 'backend', 'server'],
    source: 'YouTube - freeCodeCamp',
    lastUpdated: '2024-11-22'
  }
];
