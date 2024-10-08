import React from 'react';
import { createBrowserClient } from '@supabase/ssr';

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  badges: string[];
  restartQuiz: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ score, totalQuestions, badges, restartQuiz }) => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return (
    <div className="end-screen">
      <h2 className="medical-title">Quiz Voltooid!</h2>
      <p className="medical-score">Jouw score: {score}/{totalQuestions}</p>
      {badges.length > 0 && (
        <div className="badges mt-4">
          <h3>Behaalde badges:</h3>
          <ul className="badges-list">
            {badges.map((badge, index) => (
              <li key={index} className="badge-item">{badge}</li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={restartQuiz} className="medical-button mt-4">
        Quiz opnieuw starten
      </button>
    </div>
  );
};

export default QuizResult;