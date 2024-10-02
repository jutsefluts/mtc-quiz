import React from 'react';

interface QuizFeedbackProps {
  feedback: string | null;
  explanation: string | null;
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({ feedback, explanation }) => (
  <div className="result">
    <div className="feedback-container">
      <p className="feedback-text">{feedback}</p>
      {explanation && (
        <div className="ai-feedback">
          <p>{explanation}</p>
        </div>
      )}
    </div>
  </div>
);

export default QuizFeedback;
