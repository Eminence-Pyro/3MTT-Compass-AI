
import { Assessment, Question } from '../types';

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

export const assessments: Assessment[] = [
  {
    id: 'fullstack-assessment',
    track: 'fullstack',
    questions: fullStackQuestions
  }
  // Add more assessments for other tracks as needed
];
