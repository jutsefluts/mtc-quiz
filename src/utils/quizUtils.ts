import { UserWordPerformance } from '../types/UserWordPerformance';

export function calculateDifficulty(performance: UserWordPerformance): number {
  if (performance.total_attempts === 0) return 1; // New word
  return 1 - (performance.correct_attempts / performance.total_attempts);
}

export function calculateNextReviewDate(performance: UserWordPerformance): Date {
  const difficulty = calculateDifficulty(performance);
  const daysUntilNextReview = Math.ceil(1 + (difficulty * 7)); // 1-8 days
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + daysUntilNextReview);
  return nextReview;
}