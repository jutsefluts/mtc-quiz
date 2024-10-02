export interface UserWordPerformance {
  id: string;
  userId: string;
  wordId: string;
  correctAttempts: number;
  totalAttempts: number;
  lastReviewDate: Date;
  nextReviewDate: Date;
}
