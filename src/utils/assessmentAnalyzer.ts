
import { Question } from '../types';
import { AssessmentResult } from '../types/assessment';

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
