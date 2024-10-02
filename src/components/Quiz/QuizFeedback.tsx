import React from 'react';

interface QuizFeedbackProps {
  feedback: string | null;
  explanation: string | null;
}

const QuizFeedback: React.FC<QuizFeedbackProps> = ({ feedback, explanation }) => (
  <div className="feedback-container">
    {feedback && (
      <>
        <p className="correctness-feedback">{feedback}</p>
        {explanation && <hr className="feedback-divider" />}
      </>
    )}
    {explanation && (
      <div className="ai-feedback">
        <p>{explanation}</p>
      </div>
    )}
  </div>
);

export default QuizFeedback;
