export interface UserWordPerformance {
  id: string;
  user_id: string;
  word_id: number;  // Changed from string to number
  correct_attempts: number;
  total_attempts: number;
  last_review_date: string;  // Changed to string as it's stored as timestamptz in the database
  next_review_date: string | null;  // Changed to string | null
}
