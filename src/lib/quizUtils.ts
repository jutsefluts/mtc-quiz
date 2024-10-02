import { UserWordPerformance } from '../types/UserWordPerformance';

export function calculateDifficulty(performance: UserWordPerformance): number {
  if (performance.totalAttempts === 0) return 1; // New word
  return 1 - (performance.correctAttempts / performance.totalAttempts);
}

export function calculateNextReviewDate(performance: UserWordPerformance): Date {
  const difficulty = calculateDifficulty(performance);
  const daysUntilNextReview = Math.ceil(1 + (difficulty * 7)); // 1-8 days
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + daysUntilNextReview);
  return nextReview;
}