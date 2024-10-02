import React from 'react';

interface Word {
  id: number;
  word: string;
  description: string;
}

interface QuizState {
  quizState: 'start' | 'inProgress' | 'end';
  isLoading: boolean;
  words: Word[];
  currentQuestion: Word | null;
  isQuestionWord: boolean;
  options: string[];
  selectedOption: string | null;
  score: number;
  questionCount: number;
  feedback: string | null;
  showResult: boolean;
  explanation: string | null;
  badges: string[];
  loadingProgress: number;
}

interface QuizActions {
  startQuiz: () => Promise<void>;
  endQuiz: () => void;
  restartQuiz: () => void;
  nextQuestion: () => void;
  handleAnswer: (selectedOption: string) => Promise<void>;
}

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  badges: string[];
  restartQuiz: () => void;
}

const QuizResult: React.FC<QuizResultProps> = ({ score, totalQuestions, badges, restartQuiz }) => (
  <div className="end-screen">
    <h2 className="medical-title">Quiz Voltooid!</h2>
    <p className="medical-score">Jouw score: {score}/{totalQuestions}</p>
    {badges.length > 0 && (
      <div className="badges mt-4">
        <h3>Behaalde badges:</h3>
        <ul>
          {badges.map((badge, index) => (
            <li key={index}>{badge}</li>
          ))}
        </ul>
      </div>
    )}
    <button onClick={restartQuiz} className="medical-button mt-4">
      Quiz opnieuw starten
    </button>
  </div>
);

export default QuizResult;